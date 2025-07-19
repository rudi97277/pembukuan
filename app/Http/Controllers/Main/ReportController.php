<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Models\Employee;
use App\Models\Report;
use App\Models\ReportDetail;
use App\Repositories\ReportRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function __construct(
        private ReportRepository $repository
    ) {}
    public function index(Request $request)
    {
        $request->validate([
            'keyword' => 'nullable|string',
            'sort' => 'nullable|array',
            'sort.*' => 'nullable|string|in:asc,desc',
            'year' => 'nullable|date_format:Y',
        ]);

        $year = $request->input('year', date('Y'));
        $data = $this->repository->getPaginatedReports($request, $year);


        return Inertia::render('report', [
            'paginated' => $data,
            'sorted' => $request->sort ?? [],
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
            'date' => 'required|date',
            'division' => 'nullable|string'
        ]);

        $this->repository->generateReportDetails($request, $id);
        $usedDates = $this->repository->getReportUsedDates($id);
        $divisions = Division::selectRaw("name as label,name as value")->get();

        $data = $this->repository->getPaginatedReportDetails($request, $id);

        return Inertia::render('report-detail', [
            'sorted' => $request->sort ?? [],
            'date' => $request->date ?? now(),
            'keyword' => $request->keyword,
            'paginated' => $data,
            'report_id' => $id,
            'used_dates' => $usedDates,
            'division' => $request->division,
            'divisions' => $divisions
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

        $update = [
            'is_claim_save' => $request->is_claim_save ?? $reportDetail->is_claim_save
        ];

        if ($request->breakfast) {
            $update['breakfast'] = $request->breakfast  == $reportDetail->breakfast ? null : $request->breakfast;
        } else if ($request->lunch) {
            $update['lunch'] = $request->lunch  == $reportDetail->lunch ? null : $request->lunch;
        } else if ($request->dinner) {
            $update['dinner'] = $request->dinner  == $reportDetail->dinner ? null : $request->dinner;
        }


        $reportDetail->update($update);
        Employee::where('id', $reportDetail->employee_id)->update($update);
    }

    public function storeDetail(Request $request, int $reportId)
    {
        $request->validate([
            'date' => 'required|date',
            'name' => 'required|string',
            'employee_id' => 'required|integer',
            'division' => 'required|string',
            'type' => 'required|in:vendor,guest',
            'breakfast' => 'required|in:Meal,Save',
            'lunch' => 'required|in:Meal,Save',
            'dinner' => 'required|in:Meal,Save',
            'is_claim_save' => 'required|boolean',
            'quantity' => 'required|integer'
        ]);

        $division = Division::where('name', $request->division)->first();

        if ($request->employee_id == 0) {
            $employee = Employee::create([
                ...$request->only('name',  'type', 'breakfast', 'lunch', 'dinner', 'is_claim_save'),
                'division_id' => $division->id,
                'is_active' => true,

            ]);
        } else {
            $employee = Employee::where('id', $request->employee_id)->first();
        }


        ReportDetail::create([
            'date' => $request->date,
            'report_id' => $reportId,
            'employee_id' => $employee->id,
            'quantity' => $request->quantity,
            ...$employee->only('breakfast', 'lunch', 'dinner', 'is_claim_save')
        ]);
    }

    public function deleteDetail(int $reportId, int $detailId)
    {
        ReportDetail::where([
            'id' => $detailId,
            'report_id' => $reportId
        ])->delete();
    }

    public function store(Request $request)
    {
        $request->validate([
            'period' => 'nullable|date'
        ]);

        $period = Carbon::parse($request->period)->firstOfMonth();
        $currentReport = Report::where('period', $period->format('Y-m-d'))->first();

        if (!$currentReport) {
            Report::create([
                'period' => $period->format('Y-m-d'),
                'working_days' => 0,
                'is_complete' => false
            ]);
        }
    }

    public function reportEmployees(Request $request)
    {
        $request->validate([
            'keyword' => 'nullable|string',
            'sort' => 'nullable|array',
            'sort.*' => 'nullable|string|in:asc,desc',
            'period' => 'required|date',
            'division' => 'nullable|string'
        ]);

        if (!$request->sort) {
            $request->merge([
                'sort' => [
                    'date' => 'asc',
                    'name' => 'asc'
                ]
            ]);
        }


        $data = $this->repository->getAllReportDetail($request);
        $divisions = Division::selectRaw("name as label,name as value")->get();

        return Inertia::render('report-employee', [
            'sorted' => $request->sort ?? [],
            'data' => $data,
            'period' => $request->period,
            'keyword' => $request->keyword,
            'division' => $request->division,
            'divisions' => $divisions
        ]);
    }
}
