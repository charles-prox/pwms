<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Position;
use Inertia\Inertia;

class PositionController extends Controller
{
    public function index()
    {
        $positions = Position::all();

        return Inertia::render('Positions/Index', [
            'positions' => $positions,
        ]);
    }

    // OR if you just want JSON response (for API, dropdown, etc.)
    public function list()
    {
        return response()->json(Position::all());
    }
}
