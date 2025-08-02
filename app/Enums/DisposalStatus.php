<?php

namespace App\Enums;

enum DisposalStatus: string
{
    case MarkedForDisposal = 'marked_for_disposal';
    case CheckedByRDC = 'checked_by_rdc';
    case TransferredToDisposalArea = 'transferred_to_disposal_area';
    case CheckedByCOA = 'checked_by_coa';
    case WaitingForNAPApproval = 'waiting_for_nap_approval';
    case NAPApproved = 'nap_approved';
    case ScheduledForDisposal = 'scheduled_for_disposal';
    case Disposed = 'disposed';
    case CertificateIssued = 'certificate_issued';
    case COAReturned = 'coa_returned';
    case DisposalCancelled = 'disposal_cancelled';
    case BoxIncomplete = 'box_incomplete';
    case OnHold = 'on_hold';
    case PendingFinalReview = 'pending_final_review';
}
