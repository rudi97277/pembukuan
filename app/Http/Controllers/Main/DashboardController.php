<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Repositories\ReportRepository;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private ReportRepository $reportRepository,
        private DashboardService $service
    ) {}
    public function index(Request $request)
    {
        $request->validate([
            'period' => 'nullable|date|date_format:Y-m'
        ]);
        $mealSave = $this->reportRepository->getMealSaveTotal($request);
        $mealSaveYearly = $this->reportRepository->getMealSaveTotalYearly($request);


        $trendGraph = $this->service->prepareTrendGraph();

        $trendMeal = 0;
        $trendSave = 0;
        foreach ($mealSaveYearly as $item) {
            $trendGraph[$item->month]['Meal'] = $item->meal;
            $trendGraph[$item->month]['Save'] = $item->save;
            $trendMeal += $item->meal;
            $trendSave += $item->save;
        }


        $graph = $this->service->prepareDashboardGraph();
        $total = count($mealSave);
        foreach ($mealSave as $idx => $items) {
            foreach (collect($items) as $key => $item) {
                $exploded = explode('_', $key);
                $graph[$exploded[1]][$exploded[0]]['total'] += $item;
                $graph[$exploded[1]][$exploded[0]]['data'][] = $item;

                if ($total === $idx + 1) {
                    $graph[$exploded[1]][$exploded[0]]['trend'] = $item >= $graph[$exploded[1]][$exploded[0]]['data'][0] ? 'up' : 'down';
                }
            }
        }

        $divisionData = $this->reportRepository->getReportByDivision($request);

        return Inertia::render('dashboard', [
            'meal' => $graph['meal'],
            'save' => $graph['save'],
            'division_data' => $divisionData,
            'period' => $request->period,
            'trend' => [
                'graph' => array_values($trendGraph),
                'save' => $trendSave,
                'meal' => $trendMeal
            ]
        ]);
    }
}
