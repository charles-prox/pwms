<?php

namespace App\Services\Requests;

use App\Models\Request as RequestModel;
use App\Models\Box;
use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request as HttpRequest;

class RequestStatusService
{
    public function authorizeUser()
    {
        /** @var \App\Models\User|\Spatie\Permission\Traits\HasRoles $user */
        $user = Auth::user();
        if (!$user || !$user->hasAnyRole(['super-admin', 'regional-document-custodian'])) {
            abort(403, 'Forbidden');
        }
    }

    public function validateRequest(HttpRequest $request)
    {
        return $request->validate([
            'id' => 'required|exists:requests,id',
            'status' => 'required|string|in:approved,rejected,completed',
            'remarks' => 'required_if:status,rejected|string|max:1000',
            'approved_form' => 'required_if:status,approved|file|mimes:pdf|max:5120',
            'boxes' => 'required_if:status,completed|array',
            'boxes.*.id' => 'required|exists:boxes,id',
            'boxes.*.location.floor' => 'required|string|in:mezzanine,ground',
            'boxes.*.location.rack' => 'required|integer',
            'boxes.*.location.bay' => 'required|integer',
            'boxes.*.location.level' => 'required|integer',
            'boxes.*.location.position' => 'required|integer',
        ]);
    }

    public function handleApprovedUpload(HttpRequest $request, RequestModel $requestModel)
    {
        if ($request->hasFile('approved_form')) {
            $pdfPath = $requestModel->pdf_path;
            $request->file('approved_form')->move(
                dirname($pdfPath),
                basename($pdfPath)
            );
        }
    }

    public function assignBoxLocations(array $boxes)
    {
        DB::transaction(function () use ($boxes) {
            foreach ($boxes as $boxData) {
                $box = Box::findOrFail($boxData['id']);
                $locationData = $boxData['location'];

                $location = Location::where([
                    'floor' => $locationData['floor'],
                    'rack' => $locationData['rack'],
                    'bay' => $locationData['bay'],
                    'level' => $locationData['level'],
                ])->firstOrFail();

                if ($location->current_boxes >= $location->total_positions * $location->capacity_per_position) {
                    throw new \Exception("Location {$location->id} has reached full capacity.");
                }

                $box->boxLocations()->create([
                    'location_id' => $location->id,
                    'position' => $locationData['position'],
                ]);

                $location->increment('current_boxes');

                if (!$location->office_id) {
                    $location->office_id = $box->office_id;
                    $location->save();
                }
            }
        });
    }
}
