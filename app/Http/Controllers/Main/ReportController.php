<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Models\Employee;
use App\Models\Report;
use App\Models\ReportDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'keyword' => 'nullable|string',
            'sort' => 'nullable|array',
            'sort.*' => 'nullable|string|in:asc,desc',
            'year' => 'nullable|date_format:Y',
        ]);

        $year = $request->input('year', date('Y'));

        $data = Report::whereYear('period', $year)
            ->orderBy('period', 'desc')
            ->with(['details' => fn($q) => $q->select('report_id', 'date')->groupBy('date', 'report_id')])
            ->selectRaw("
                id,
                id as `key`,
                period,
                is_complete,
                working_days

            ")
            ->paginate($request->input('page_size', 10));

        $sorted = $request->sort ?? [];

        return Inertia::render('report', [
            'paginated' => $data,
            'sorted' => $sorted,
            'year' => $year,
            'keyword' => $request->keyword,
        ]);
    }

    public function show(Request $request, int $id)
    {
        $request->validate([
            'keyword' => 'nullable|string',
            'sort' => 'nullable|array',
            'sort.*' => 'nullable|string|in:asc,desc',
            'date' => 'required|date'
        ]);

        $count = ReportDetail::where(['report_id' => $id, 'date' => $request->date])->count();
        if ($count == 0) {
            Report::where('id', $id)->update(['working_days' => DB::raw('working_days + 1')]);
            $employees = Employee::where('type', Employee::VENDOR)->get();
            $inserts = [];
            foreach ($employees as $employee) {
                $inserts[] = [
                    'report_id' => $id,
                    'date' => $request->date,
                    'quantity' => 1,
                    'updated_at' => now(),
                    'created_at' => now(),
                    'employee_id' => $employee->id,
                    ...$employee->only('breakfast', 'lunch', 'dinner', 'is_claim_save')
                ];
            }
            ReportDetail::insert($inserts);
        }

        $usedDates = ReportDetail::where(['report_id' => $id])->select('report_id', 'date')->groupBy('date', 'report_id')->get();
        $sorted = $request->sort ?? [];

        $data = ReportDetail::from('report_details as rd')->where('rd.report_id', $id)
            ->where('rd.date', $request->date)
            ->join('employees as e', 'e.id', 'rd.employee_id')
            ->join('divisions as d', 'd.id', 'e.division_id')
            ->when($request->keyword, fn($q) => $q->where('e.name', 'like', "%{$request->keyword}%"))
            ->selectRaw("
                rd.id as `key`,
                rd.id,
                e.name,
                d.name as division,
                rd.breakfast,
                rd.lunch,
                rd.dinner,
                rd.is_claim_save,
                (
                    case when rd.breakfast = 'Save' and rd.is_claim_save = 1 then 40000*rd.quantity else 0 end +
                    case when rd.lunch = 'Save' and rd.is_claim_save = 1 then 60000*rd.quantity else 0 end +
                    case when rd.dinner = 'Save' and rd.is_claim_save = 1 then 60000*rd.quantity else 0 end
                ) as save_total
            ")
            ->orderBy('rd.created_at', 'desc')
            ->when($request->division, fn($q) => $q->where('d.name', $request->division))
            ->paginate($request->input('page_size', 10));

        $division = Division::selectRaw("
            name as label,
            name as value
        ")->get();


        return Inertia::render('report-detail', [
            'sorted' => $sorted,
            'date' => $request->date ?? now(),
            'keyword' => $request->keyword,
            'paginated' => $data,
            'report_id' => $id,
            'used_dates' => $usedDates,
            'division' => $request->division,
            'divisions' => $division
        ]);
    }

    public function updateDetail(Request $request, int $reportId, int $detailId)
    {
        $request->validate([
            'breakfast' => 'nullable|in:Meal,Save',
            'lunch' => 'nullable|in:Meal,Save',
            'dinner' => 'nullable|in:Meal,Save',
            'is_claim_save' => 'nullable|boolean'
        ]);

        $reportDetail = ReportDetail::where([
            'id' => $detailId,
            'report_id' => $reportId
        ])->first();

        $reportDetail->update($request->only('breakfast', 'lunch', 'dinner', 'is_claim_save'));
        Employee::where('id', $reportDetail->employee_id)->update($request->only('breakfast', 'lunch', 'dinner', 'is_claim_save'));
    }

    public function storeDetail(Request $request, int $reportId)
    {
        $request->validate([
            'date' => 'required|date',
            'name' => 'required|string',
            'division' => 'required|string',
            'type' => 'required|in:vendor,guest',
            'breakfast' => 'required|in:Meal,Save',
            'lunch' => 'required|in:Meal,Save',
            'dinner' => 'required|in:Meal,Save',
            'is_claim_save' => 'required|boolean',
            'quantity' => 'required|integer'
        ]);

        $division = Division::where('name', $request->division)->first();

        $employee = Employee::create([
            ...$request->only('name',  'type', 'breakfast', 'lunch', 'dinner', 'is_claim_save'),
            'division_id' => $division->id,
            'is_active' => true,

        ]);

        ReportDetail::create([
            'date' => $request->date,
            'report_id' => $reportId,
            'employee_id' => $employee->id,
            'quantity' => $request->quantity,
            ...$employee->only('breakfast', 'lunch', 'dinner', 'is_claim_save')
        ]);
    }

    public function store()
    {
        $now = Carbon::now()->firstOfMonth();
        $currentReport = Report::where('period', $now->format('Y-m-d'))->first();

        if (!$currentReport) {
            Report::create([
                'period' => $now->format('Y-m-d'),
                'working_days' => 0,
                'is_complete' => false
            ]);
        }
    }
}
