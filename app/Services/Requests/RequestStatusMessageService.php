<?php

namespace App\Services\Requests;

class RequestStatusMessageService
{
    public static function getDefaultRemark(string $status, string $requestType): ?string
    {
        return match ($status) {
            'approved' => match ($requestType) {
                'storage' => 'Proceed with transporting the boxes to the warehouse for storage. Coordinate with GSU for vehicle assistance and further instructions.',
                'withdrawal' => 'You may now proceed with withdrawing the boxes. Please coordinate with the records custodian.',
                'return' => 'You may now proceed with returning the boxes to the warehouse. Coordinate with GSU for vehicle assistance.',
                'disposal' => 'Proceed with the disposal process as scheduled.',
                default => 'Request approved. Please proceed accordingly.',
            },

            'partially_completed' => match ($requestType) {
                'storage' => 'Only some boxes were stored successfully. Please review the remarks for pending items.',
                'withdrawal' => 'Some boxes were successfully withdrawn. Please check remarks for those that failed.',
                'return' => 'Some boxes were returned. Please coordinate with GSU for the remaining boxes.',
                'disposal' => 'Partial disposal completed. Verify pending boxes for next action.',
                default => 'The request was partially completed. Please review details.',
            },

            'failed' => match ($requestType) {
                'storage' => 'Box storage failed. Please review the remarks and attempt again.',
                'withdrawal' => 'Withdrawal failed for all boxes. Please check the remarks and try again.',
                'return' => 'Return failed. No boxes were accepted. Review the issues and retry.',
                'disposal' => 'Disposal failed. No boxes were processed. Check system or procedural errors.',
                default => 'The request failed. Please investigate the issue.',
            },

            'completed' => match ($requestType) {
                'storage' => 'All boxes have been successfully stored in the warehouse.',
                'withdrawal' => 'All boxes have been successfully withdrawn.',
                'return' => 'All boxes have been successfully returned to the warehouse.',
                'disposal' => 'All boxes have been successfully disposed.',
                default => 'The request has been completed successfully.',
            },

            'rejected' => match ($requestType) {
                'storage' => 'Storage request has been rejected. Please coordinate with your division head for further clarification.',
                'withdrawal' => 'Withdrawal request has been rejected. Contact your records officer for details.',
                'return' => 'Return request has been rejected. Coordinate with GSU for next steps.',
                'disposal' => 'Disposal request has been rejected. Please review compliance or scheduling issues.',
                default => 'The request has been rejected.',
            },

            default => null,
        };
    }
}
