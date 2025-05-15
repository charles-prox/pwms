<?php

namespace App\Http\Controllers;

use App\Models\Request as RequestModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;

class RequestsController extends Controller
{
    /**
     * Create a new blank request based on type and generate a unique form number.
     */
    public function createBlankRequest(string $type)
    {
        $type = strtolower($type);
        $uid = Auth::id();

        $validTypes = [
            'storage'    => 'S',
            'withdrawal' => 'W',
            'return'     => 'R',
            'disposal'   => 'D',
        ];

        if (!array_key_exists($type, $validTypes)) {
            return response()->json(['error' => 'Invalid request type'], 400);
        }

        $prefix = $validTypes[$type];
        $year = Carbon::now()->year;

        // Get the latest request of the same type in the current year
        $latestRequest = RequestModel::where('request_type', $type)
            ->whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        // Extract the series number
        $lastSeries = 0;
        if ($latestRequest && preg_match('/\d{4}-(\d+)$/', $latestRequest->form_number ?? '', $matches)) {
            $lastSeries = (int) $matches[1];
        }

        $newSeries = str_pad($lastSeries + 1, 3, '0', STR_PAD_LEFT);
        $formNumber = "{$prefix}-{$year}-{$newSeries}";

        // Create the new request
        $request = new RequestModel();
        $request->request_type = $type;
        $request->status = 'draft';
        $request->is_draft = true;
        $request->form_number = $formNumber;
        $request->created_by = $uid; // Assumes user is logged in
        $request->created_at = now();
        $request->updated_by = $uid;
        $request->updated_at = now();
        $request->save();

        return response()->json([
            'message' => 'Blank request created successfully',
            'form_no' => $formNumber,
            'request' => $request
        ]);
    }

    public function getFormDetails(string $form_no)
    {
        $request = RequestModel::where('form_number', $form_no)->firstOrFail();

        return Inertia::render('RequestStorage', [
            'form' => [
                'number'      => $form_no,
                'last_update' => $request->updated_at->format('Y-m-d H:i'),
            ],
        ]);
    }
}
