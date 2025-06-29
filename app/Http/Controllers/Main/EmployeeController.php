<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function list(Request $request)
    {
        $request->validate([
            'keyword' => 'nullable|string'
        ]);
        $employees = Employee::when($request->keyword, fn($q) => $q->where('name', 'like', "%{$request->keyword}%"))
            ->selectRaw("
                id as value,
                name as label
            ")
            ->limit(20)
            ->get();

        return response()->json($employees);
    }
}
