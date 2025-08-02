<?php

namespace App\Services\Requests;

use App\Models\Request as RequestModel;
use App\Models\Box;
use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request as HttpRequest;
use App\Enums\RequestStatus;
use App\Enums\DisposalStatus;
use Illuminate\Validation\Rule;

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
        $allStatuses = array_merge(
            array_column(RequestStatus::cases(), 'value'),
            array_column(DisposalStatus::cases(), 'value')
        );

        return $request->validate([
            'id' => 'required|exists:requests,id',

            // Accept status from either enum
            'status' => ['required', 'string', Rule::in($allStatuses)],

            'remarks' => 'required_if:status,rejected|string|max:1000',
            'approved_form' => 'required_if:status,approved|file|mimes:pdf|max:5120',
            'boxes' => 'required_if:status,completed|array',
            'boxes.*.id' => 'required|exists:boxes,id',

            // Only for storage
            'boxes.*.location.floor' => 'required_if:request_type,storage|string|in:mezzanine,ground',
            'boxes.*.location.rack' => 'required_if:request_type,storage|integer',
            'boxes.*.location.bay' => 'required_if:request_type,storage|integer',
            'boxes.*.location.level' => 'required_if:request_type,storage|integer',
            'boxes.*.location.position' => 'required_if:request_type,storage|integer',

            'boxes.*.status' => 'nullable|string',
            'boxes.*.remarks' => 'nullable|string',
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

    public function assignBoxLocations(array $boxes,  RequestModel $request)
    {
        try {
            DB::transaction(function () use ($boxes, $request) {
                $pivotData = [];
                foreach ($boxes as $boxData) {
                    try {
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

                        $box->boxLocation()->create([
                            'location_id' => $location->id,
                            'position' => $locationData['position'],
                        ]);

                        $location->increment('current_boxes');

                        if (!$location->office_id) {
                            $location->office_id = $box->office_id;
                            $location->save();
                        }

                        $box->status = 'stored';
                        $box->save();


                        if (isset($boxData['remarks'])) {
                            $pivotData[$box->id] = [
                                'storage_completion_remarks' => $boxData['remarks'],
                            ];
                        }
                    } catch (\Throwable $e) {
                        throw new \Exception("Error in box ID {$boxData['id']}: " . $e->getMessage(), 0, $e);
                    }
                }

                if (!empty($pivotData)) {
                    $request->boxes()->syncWithoutDetaching($pivotData);
                }
            });
        } catch (\Throwable $e) {
            // You can use Laravel's logger instead of dd() in production
            dd("Transaction failed:", $e->getMessage(), $e->getTraceAsString());
        }
    }

    public function confirmBoxWithdrawals(array $boxes, RequestModel $request): string
    {
        return DB::transaction(function () use ($boxes, $request) {
            $withdrawnCount = 0;
            $total = count($boxes);

            foreach ($boxes as $boxData) {
                $boxId = $boxData['id'];
                $status = $boxData['status'];
                $remarks = $boxData['remarks'] ?? null;

                if (!empty($remarks)) {
                    $request->boxes()->updateExistingPivot($boxId, [
                        'withdrawal_completion_remarks' => $remarks,
                    ]);
                }

                if ($status === 'withdrawn') {
                    Box::where('id', $boxId)->update(['status' => 'withdrawn']);
                    $withdrawnCount++;
                } else {
                    Box::where('id', $boxId)->update(['status' => 'withdrawal_failed']);
                }
            }

            // Final status based on result
            $finalStatus = match (true) {
                $withdrawnCount === $total => 'completed',
                $withdrawnCount > 0 => 'partially_completed',
                default => 'failed',
            };

            $request->update(['status' => $finalStatus]);

            return $finalStatus;
        });
    }

    public function confirmBoxReturn(array $boxes, RequestModel $request): string
    {
        return DB::transaction(function () use ($boxes, $request) {
            $withdrawnCount = 0;
            $total = count($boxes);

            foreach ($boxes as $boxData) {
                $boxId = $boxData['id'];
                $status = $boxData['status'];
                $remarks = $boxData['remarks'] ?? null;

                if (!empty($remarks)) {
                    $request->boxes()->updateExistingPivot($boxId, [
                        'return_completion_remarks' => $remarks,
                    ]);
                }

                if ($status === 'returned') {
                    Box::where('id', $boxId)->update(['status' => 'stored']);
                    $withdrawnCount++;
                } else {
                    Box::where('id', $boxId)->update(['status' => 'return_failed']);
                }
            }

            // Final status based on result
            $finalStatus = match (true) {
                $withdrawnCount === $total => 'completed',
                $withdrawnCount > 0 => 'partially_completed',
                default => 'failed',
            };

            $request->update(['status' => $finalStatus]);

            return $finalStatus;
        });
    }

    public function confirmBoxDisposal(array $boxes, RequestModel $request): string
    {
        return DB::transaction(function () use ($boxes, $request) {
            $disposedCount = 0;
            $total = count($boxes);

            foreach ($boxes as $boxData) {
                $boxId = $boxData['id'];
                $status = $boxData['status'];
                $remarks = $boxData['remarks'] ?? null;

                if (!empty($remarks)) {
                    $request->boxes()->updateExistingPivot($boxId, [
                        'disposal_completion_remarks' => $remarks,
                    ]);
                }

                if ($status === 'disposed') {
                    Box::where('id', $boxId)->update(['status' => 'disposed']);
                    $disposedCount++;
                } else {
                    Box::where('id', $boxId)->update(['status' => 'disposal_failed']);
                }
            }

            // Determine final request status
            $finalStatus = match (true) {
                $disposedCount === $total => 'completed',
                $disposedCount > 0 => 'partially_completed',
                default => 'failed',
            };

            $request->update(['status' => $finalStatus]);

            return $finalStatus;
        });
    }
}
