<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index()
    {
        return Document::with(['box', 'rds'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'box_id' => 'required|exists:boxes,id',
            'rds_id' => 'required|exists:rds,id',
            'document_code' => 'nullable|string|max:50',
            'description' => 'required|string',
            'document_date' => 'required|date',
            'disposal_date' => 'required|date',
            'status' => 'required|string|max:20',
            'added_by' => 'required|exists:users,hris_id',
        ]);

        $validated['added_at'] = now();

        $document = Document::create($validated);

        return response()->json([
            'message' => 'Document created successfully.',
            'document' => $document
        ]);
    }
}
