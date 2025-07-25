<?php

namespace App\Services\Requests;

use App\Models\Request as RequestModel;
use App\Models\Box;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class RequestWithdrawalService
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
                    'status' => $status . ' withdrawal',
                ]);

                // Collect pivot remarks (for withdrawal)
                $pivotData[$boxData['id']] = [
                    'withdrawal_remarks' => $boxData['request_remarks']['withdrawal'] ?? null,
                ];
            }

            // Sync to pivot table (request_box)
            $form->boxes()->syncWithoutDetaching($pivotData);
        });
    }
}
