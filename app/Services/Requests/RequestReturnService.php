<?php

namespace App\Services\Requests;

use App\Models\Request as RequestModel;
use Illuminate\Http\Request as HttpRequest;
use App\Models\Box;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use App\Models\RequestStatusLog;
use App\Http\Resources\BoxResource;

class RequestReturnService
{
    public function saveRequestData(HttpRequest $request, string $formNumber, string $status = 'draft'): void
    {
        DB::transaction(function () use ($request, $formNumber, $status) {
            $user = Auth::user();
            $form = RequestModel::where('form_number', $formNumber)->firstOrFail();

            $form->update([
                'status' => $status,
                'is_draft' => $status === 'draft',
                'updated_by' => $user->id,
            ]);
            $form->logStatus('pending', $user->id, 'Request submitted for review and approval.');

            $boxes = $request->input('boxes', []);
            $pivotData = [];

            foreach ($boxes as $boxData) {
                // Update the existing box's status
                Box::where('id', $boxData['id'])->update([
                    'status' => $status . ' return',
                ]);

                $pivotData[$boxData['id']] = [
                    'return_remarks' => $boxData['request_remarks']['return'] ?? null,
                ];
            }

            // Sync to pivot table (request_box)
            $form->boxes()->syncWithoutDetaching($pivotData);
        });
    }

    /**
     * Attach the latest completed withdrawal request to each box.
     *
     * @param \Illuminate\Support\Collection|Box[] $boxes
     * @return \Illuminate\Support\Collection
     */
    public function attachWithdrawalRequest($boxes)
    {
        $boxes = $boxes->map(function ($box) {
            $withdrawalLog = RequestStatusLog::where('status', 'like', '%completed')
                ->whereHas('request', function ($q) use ($box) {
                    $q->where('request_type', 'withdrawal')
                        ->whereHas('boxes', function ($q2) use ($box) {
                            $q2->where('boxes.id', $box->id);
                        });
                })
                ->with('request:id,form_number')
                ->orderByDesc('created_at')
                ->first();
            // dd($withdrawalLog->toArray());

            $box->withdrawal_request = $withdrawalLog && $withdrawalLog->request ? [
                'request_id' => $withdrawalLog->request_id,
                'form_number' => $withdrawalLog->request->form_number,
                'completed_at' => $withdrawalLog->created_at
                    ? Carbon::parse($withdrawalLog->created_at)->format('m/d/Y')
                    : null,
            ] : null;

            return (new BoxResource($box))->toArray(request());
        });

        return $boxes;
    }
}
