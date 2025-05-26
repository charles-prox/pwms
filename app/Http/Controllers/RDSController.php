<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RDS;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class RDSController extends Controller
{
    public function import(Request $request): JsonResponse
    {
        // Define expected headers
        $expectedHeaders = ['module', 'item_no', 'title_description', 'active', 'storage', 'remarks', 'department'];

        // Validate the uploaded file
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:csv,txt|max:2048', // Ensure it's a CSV file
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
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
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid CSV headers. Please ensure the file follows the correct format.',
                    ], 422);
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

                return response()->json([
                    'success' => true,
                    'message' => 'File uploaded successfully!',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'Unable to open the file.',
            ], 500);
        }

        return response()->json([
            'success' => false,
            'message' => 'No file uploaded.',
        ], 400);
    }

    /**
     * Get RDS items with optional pagination, search, and filters.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 10); // Default to 10
        $page = $request->input('page', 1);
        $searchKey = $request->input('search_key', ''); // Search term
        $filters = $request->input('filters', []); // Filters
        $fetchAll = $request->input('all', false); // If true, fetch all data

        $query = RDS::query();

        // Define filterable columns
        $filterable_columns = ['title_description', 'department', 'module', 'item_no'];

        // Apply search
        if (!empty($searchKey)) {
            $query->where('title_description', 'ILIKE', "%{$searchKey}%");
        }

        // Apply filters with validation
        if (!empty($filters) && is_array($filters)) {
            foreach ($filters as $filter) {
                if (
                    !empty($filter['column']) &&
                    in_array($filter['column'], $filterable_columns, true) &&
                    isset($filter['value'])
                ) {
                    $query->where($filter['column'], 'ILIKE', "%{$filter['value']}%");
                }
            }
        }

        // Fetch all records or paginate
        $rdsItems = $fetchAll
            ? $query->get()
            : $query->paginate($perPage, ['*'], 'page', $page);

        // Format response data
        $formattedData = $rdsItems->map(function ($rds) {
            // Check if active or storage is "Permanent"
            $active = trim($rds->active);
            $storage = trim($rds->storage);

            $retention_period = (strcasecmp($active, "Permanent") === 0 || strcasecmp($storage, "Permanent") === 0)
                ? "Permanent"
                : ((int) $active + (int) $storage);

            return [
                'id' => $rds->id,
                'rds_number' => "RDS-" . $rds->module . " #" . $rds->item_no,
                'document_title' => $rds->title_description,
                'retention_period' => $retention_period,
                'department' => $rds->department,
            ];
        });
        // dd($formattedData);

        return response()->json([
            'success' => true,
            'data' => $fetchAll ? $formattedData : $rdsItems->setCollection($formattedData),
            'filterable_columns' => $filterable_columns,
        ], 200);
    }
}
