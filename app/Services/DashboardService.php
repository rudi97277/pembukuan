<?php

namespace App\Services;

use Carbon\Carbon;

class DashboardService
{

    public function prepareDashboardGraph()
    {
        return  [
            'meal' => [
                'breakfast' => [
                    'total' => 0,
                    'data' => [],
                    'trend' => null
                ],
                'lunch' => [
                    'total' => 0,
                    'data' => []
                ],
                'dinner' => [
                    'total' => 0,
                    'data' => [],
                    'trend' => null
                ],
            ],
            'save' => [
                'breakfast' => [
                    'total' => 0,
                    'data' => [],
                    'trend' => null
                ],
                'lunch' => [
                    'total' => 0,
                    'data' => [],
                    'trend' => null
                ],
                'dinner' => [
                    'total' => 0,
                    'data' => [],
                    'trend' => null
                ],
            ],
            'claim' => [
                'breakfast' => [
                    'total' => 0,
                    'data' => [],
                    'trend' => null
                ],
                'lunch' => [
                    'total' => 0,
                    'data' => [],
                    'trend' => null
                ],
                'dinner' => [
                    'total' => 0,
                    'data' => [],
                    'trend' => null
                ],
            ]
        ];
    }

    public function prepareTrendGraph()
    {
        $start = Carbon::now()->startOfYear();
        $end = Carbon::now()->endOfYear();
        $template = [];
        while ($start < $end) {
            $template[$start->format('m')] = [
                "name" => $start->format('F'),
                "Meal" => 0,
                "Claim" => 0,
            ];
            $start->addMonthNoOverflow();
        }

        return $template;
    }
}
