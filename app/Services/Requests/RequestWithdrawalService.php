<?php

namespace App\Services\Requests;

use App\Models\Request as RequestModel;
use Illuminate\Http\Request as HttpRequest;

class RequestWithdrawalService
{
    public function saveRequestData(HttpRequest $request, string $formNumber, string $status = 'draft'): void
    {
        $form = RequestModel::where('form_number', $formNumber)->firstOrFail();

        // Update status
        $form->status = $status;
        $form->save();

        // Sync boxes with remarks (pivot data)
        $boxes = $request->input('boxes', []);

        // Prepare pivot data with withdrawal remarks
        $pivotData = [];
        foreach ($boxes as $box) {
            $pivotData[$box['id']] = [
                'withdrawal_remarks' => $box['request_remarks']['withdrawal'] ?? null,
            ];
        }

        // Sync to pivot table (request_box)
        $form->boxesWithRequestRemarks()->sync($pivotData);
    }
}
