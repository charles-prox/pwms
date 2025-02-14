<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RDS;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class RDSController extends Controller
{
    public function import(Request $request): Response
    {
        // Define expected headers
        $expectedHeaders = ['module', 'item_no', 'title_description', 'active', 'storage', 'remarks', 'department'];

        // Validate the uploaded file
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:csv,txt|max:2048', // Ensure it's a CSV file
        ]);

        if ($validator->fails()) {
            return Inertia::render('Rds', [
                'errors' => $validator->errors(),
            ]);
        }

        // Process the uploaded CSV file
        if ($request->hasFile('file')) {
            $file = $request->file('file');

            if (($handle = fopen($file->getPathname(), "r")) !== false) {
                // Read the first row (headers)
                $header = fgetcsv($handle);

                // Convert headers to lowercase and trim spaces
                $header = array_map(fn($h) => strtolower(trim($h)), $header);

                // Validate headers
                if ($header !== $expectedHeaders) {
                    fclose($handle);
                    return Inertia::render('Rds', [
                        'errors' => ['file' => 'Invalid CSV headers. Please ensure the file follows the correct format.'],
                    ]);
                }

                // Process each row
                while (($row = fgetcsv($handle)) !== false) {
                    // Skip invalid rows
                    if (count($row) < count($expectedHeaders)) {
                        continue;
                    }

                    // Map CSV data to database columns
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

                return Inertia::render('Rds', [
                    'success' => 'File uploaded successfully!',
                ]);
            }

            return Inertia::render('Rds', [
                'errors' => ['file' => 'Unable to open the file.'],
            ]);
        }

        return Inertia::render('Rds', [
            'errors' => 'No file uploaded.',
        ]);
    }
}
