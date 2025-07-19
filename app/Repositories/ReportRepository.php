<?php

namespace App\Repositories;

use App\Models\Division;
use App\Models\Employee;
use App\Models\Report;
use App\Models\ReportDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportRepository
{
    public function getPaginatedReports(Request $request, $year)
    {
        $sortTarget = [
            'period' => 'period',
        ];

        return Report::whereYear('period', $year)
            ->with(['details' => fn($q) => $q->select('report_id', 'date')->groupBy('date', 'report_id')])
            ->selectRaw("
                id,
                period,
                is_complete,
                working_days

            ")
            ->when($request->sort, function ($q) use ($request, $sortTarget) {
                foreach ($request->sort ?? [] as $key => $value) {
                    if (($target = $sortTarget[$key] ?? null) && $value) {
                        $q->orderBy($target, $value);
                    }
                }
            })
            ->paginate($request->input('page_size', 10));
    }

    public function generateReportDetails(Request $request, $id)
    {
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
                    // ...$employee->only('breakfast', 'lunch', 'dinner', 'is_claim_save')
                ];
            }
            ReportDetail::insert($inserts);
        }
    }


    public function getPaginatedReportDetails(Request $request, $id)
    {
        $sortTarget = [
            'name' => 'e.name',
            'division' => 'd.name',
            'save_total' => 'save_total',
            'claim_total' => 'claim_total'
        ];
        return ReportDetail::where('report_details.report_id', $id)
            ->where('report_details.date', $request->date)
            ->join('employees as e', 'e.id', 'report_details.employee_id')
            ->join('divisions as d', 'd.id', 'e.division_id')
            ->when($request->keyword, fn($q) => $q->where('e.name', 'like', "%{$request->keyword}%"))
            ->selectRaw("
                report_details.id,
                e.name,
                d.name as division,
                report_details.breakfast,
                report_details.lunch,
                report_details.dinner,
                report_details.is_claim_save,
                (
                    case when report_details.breakfast = 'Save' and report_details.is_claim_save then 40000*report_details.quantity else 0 end +
                    case when report_details.lunch = 'Save' and report_details.is_claim_save then 60000*report_details.quantity else 0 end +
                    case when report_details.dinner = 'Save' and report_details.is_claim_save then 60000*report_details.quantity else 0 end
                ) as claim_total,
                 (
                    case when report_details.breakfast = 'Save' and !report_details.is_claim_save then 40000*report_details.quantity else 0 end +
                    case when report_details.lunch = 'Save' and !report_details.is_claim_save then 60000*report_details.quantity else 0 end +
                    case when report_details.dinner = 'Save' and !report_details.is_claim_save then 60000*report_details.quantity else 0 end
                ) as save_total
            ")
            ->when($request->sort, function ($q) use ($request, $sortTarget) {
                foreach ($request->sort ?? [] as $key => $value) {
                    if (($target = $sortTarget[$key] ?? null) && $value) {
                        $q->orderBy($target, $value);
                    }
                }
            })
            ->when(!$request->sort, fn($q) => $q->orderBy('report_details.created_at', 'desc'))
            ->when($request->division, fn($q) => $q->where('d.name', $request->division))
            ->paginate($request->input('page_size', 10));
    }

    public function getAllReportDetail(Request $request)
    {
        $sortTarget = [
            'name' => 'e.name',
            'date' => 'report_details.date',
            'division' => 'd.name',
            'save_total' => 'save_total',
            'claim_total' => 'claim_total'
        ];

        return ReportDetail::join('employees as e', 'e.id', 'report_details.employee_id')
            ->join('divisions as d', 'd.id', 'e.division_id')
            ->join('reports as r', 'r.id', 'report_details.report_id')
            ->where('r.period', $request->period)
            ->where(
                fn($query) => $query->whereNotNull('report_details.breakfast')
                    ->orWhereNotNull('report_details.lunch')
                    ->orWhereNotNull('report_details.dinner')
            )
            ->when($request->keyword, fn($q) => $q->where('e.name', 'like', "%{$request->keyword}%"))
            ->selectRaw("
                report_details.id,
                e.name,
                d.name as division,
                report_details.date,
                (
                    case when report_details.breakfast = 'Meal' then 40000*report_details.quantity else 0 end +
                    case when report_details.lunch = 'Meal' then 60000*report_details.quantity else 0 end +
                    case when report_details.dinner = 'Meal' then 60000*report_details.quantity else 0 end
                ) as meal_total,
                (
                    case when report_details.breakfast = 'Save' and report_details.is_claim_save then 40000*report_details.quantity else 0 end +
                    case when report_details.lunch = 'Save' and report_details.is_claim_save then 60000*report_details.quantity else 0 end +
                    case when report_details.dinner = 'Save' and report_details.is_claim_save then 60000*report_details.quantity else 0 end
                ) as claim_total,
                 (
                    case when report_details.breakfast = 'Save' and !report_details.is_claim_save then 40000*report_details.quantity else 0 end +
                    case when report_details.lunch = 'Save' and !report_details.is_claim_save then 60000*report_details.quantity else 0 end +
                    case when report_details.dinner = 'Save' and !report_details.is_claim_save then 60000*report_details.quantity else 0 end
                ) as save_total
            ")
            ->when($request->sort, function ($q) use ($request, $sortTarget) {
                foreach ($request->sort ?? [] as $key => $value) {
                    if (($target = $sortTarget[$key] ?? null) && $value) {
                        $q->orderBy($target, $value);
                    }
                }
            })
            ->when(!$request->sort, fn($q) => $q->orderBy('report_details.created_at', 'desc'))
            ->when($request->division, fn($q) => $q->where('d.name', $request->division))
            ->get();
    }

    public function getReportUsedDates($id)
    {
        return ReportDetail::where(['report_id' => $id])->select('report_id', 'date')->groupBy('date', 'report_id')->get();
    }

    public function getMealSaveTotal(Request $request)
    {

        return ReportDetail::when(
            $request->period,
            fn($q) => $q->whereRaw('DATE_FORMAT(date, "%Y-%m") = ?', [$request->period])
        )
            ->selectRaw("
                SUM(CASE WHEN breakfast = 'Meal' THEN 40000*quantity ELSE 0 END) AS breakfast_meal,
                SUM(CASE WHEN breakfast = 'Save' and is_claim_save THEN 40000*quantity ELSE 0 END) AS breakfast_claim,
                SUM(CASE WHEN breakfast = 'Save' and !is_claim_save THEN 40000*quantity ELSE 0 END) AS breakfast_save,
                SUM(CASE WHEN lunch = 'Meal' THEN 60000*quantity ELSE 0 END) AS lunch_meal,
                SUM(CASE WHEN lunch = 'Save' and is_claim_save THEN 60000*quantity ELSE 0 END) AS lunch_claim,
                SUM(CASE WHEN lunch = 'Save' and !is_claim_save THEN 60000*quantity ELSE 0 END) AS lunch_save,
                SUM(CASE WHEN dinner = 'Meal' THEN 60000*quantity ELSE 0 END) AS dinner_meal,
                SUM(CASE WHEN dinner = 'Save' and is_claim_save THEN 60000*quantity ELSE 0 END) AS dinner_claim,
                SUM(CASE WHEN dinner = 'Save' and !is_claim_save THEN 60000*quantity ELSE 0 END) AS dinner_save
            ")
            ->get();
    }

    public function getMealSaveTotalYearly(Request $request)
    {
        $year = Carbon::parse(("$request->period"))->year;
        return ReportDetail::whereYear('date', $year)
            ->selectRaw("
                DATE_FORMAT(date, '%m') as month,
                SUM(CASE WHEN breakfast = 'Meal' THEN 40000*quantity ELSE 0 END) +
                SUM(CASE WHEN lunch = 'Meal' THEN 60000*quantity ELSE 0 END) +
                SUM(CASE WHEN dinner = 'Meal' THEN 60000*quantity ELSE 0 END) AS meal,
                SUM(CASE WHEN breakfast = 'Save' and is_claim_save THEN 40000*quantity ELSE 0 END) +
                SUM(CASE WHEN lunch = 'Save' and is_claim_save THEN 60000*quantity ELSE 0 END) +
                SUM(CASE WHEN dinner = 'Save' and is_claim_save THEN 60000*quantity ELSE 0 END) as claim,
                SUM(CASE WHEN breakfast = 'Save' and !is_claim_save THEN 40000*quantity ELSE 0 END) +
                SUM(CASE WHEN lunch = 'Save' and !is_claim_save THEN 60000*quantity ELSE 0 END) +
                SUM(CASE WHEN dinner = 'Save' and !is_claim_save THEN 60000*quantity ELSE 0 END) as save
            ")
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();
    }

    public function getReportByDivision(Request $request)
    {

        return Division::from('divisions as d')
            ->leftJoin('employees as e', 'e.division_id', 'd.id')
            ->leftJoin(
                'report_details as rd',
                fn($j) => $j->on('rd.employee_id', 'e.id')
                    ->when(
                        $request->period,
                        fn($q) => $q->whereRaw('DATE_FORMAT(rd.date, "%Y-%m") = ?', [$request->period])
                    )
                    ->whereNull('rd.deleted_at')
            )
            ->selectRaw("
                d.id,
                d.name as name,
                SUM(CASE WHEN rd.breakfast = 'Meal' THEN 40000*quantity ELSE 0 END) AS breakfast_meal,
                SUM(CASE WHEN rd.breakfast = 'Save' and rd.is_claim_save THEN 40000*quantity ELSE 0 END) AS breakfast_claim,
                SUM(CASE WHEN rd.breakfast = 'Save' and !rd.is_claim_save THEN 40000*quantity ELSE 0 END) AS breakfast_save,
                SUM(CASE WHEN rd.lunch = 'Meal' THEN 60000*quantity ELSE 0 END) AS lunch_meal,
                SUM(CASE WHEN rd.lunch = 'Save' and rd.is_claim_save THEN 60000*quantity ELSE 0 END) AS lunch_claim,
                SUM(CASE WHEN rd.lunch = 'Save' and !rd.is_claim_save THEN 60000*quantity ELSE 0 END) AS lunch_save,
                SUM(CASE WHEN rd.dinner = 'Meal' THEN 60000*quantity ELSE 0 END) AS dinner_meal,
                SUM(CASE WHEN rd.dinner = 'Save' and rd.is_claim_save THEN 60000*quantity ELSE 0 END) AS dinner_claim,
                SUM(CASE WHEN rd.dinner = 'Save' and !rd.is_claim_save THEN 60000*quantity ELSE 0 END) AS dinner_save
            ")
            ->groupBy('d.id', 'd.name')
            ->get();
    }
}
