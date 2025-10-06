<?php

namespace App\Services\RDS;

use App\Models\RDS;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RDSImportService
{
    public function import(Request $request): JsonResponse
    {
        $expectedHeaders = ['module', 'item_no', 'title_description', 'active', 'storage', 'remarks', 'department'];

        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:csv,txt|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $file = $request->file('file');
        if (!$file || !($handle = fopen($file->getPathname(), "r"))) {
            return response()->json(['success' => false, 'message' => 'Unable to open the file.'], 500);
        }

        $header = array_map(fn($h) => strtolower(trim($h)), fgetcsv($handle));

        if ($header !== $expectedHeaders) {
            fclose($handle);
            return response()->json([
                'success' => false,
                'message' => 'Invalid CSV headers. Please ensure correct format.',
            ], 422);
        }

        while (($row = fgetcsv($handle)) !== false) {
            if (count($row) < count($expectedHeaders)) continue;

            RDS::create([
                'module'            => $row[0],
                'item_no'           => (float) $row[1],
                'title_description' => $row[2],
                'active'            => $row[3] ?? null,
                'storage'           => $row[4] ?? null,
                'remarks'           => $row[5] ?? null,
                'department'        => $row[6] ?? null,
            ]);
        }

        fclose($handle);

        return response()->json(['success' => true, 'message' => 'File uploaded successfully!']);
    }
}
