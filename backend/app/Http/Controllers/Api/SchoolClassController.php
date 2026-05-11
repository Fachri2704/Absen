<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SchoolClassController extends Controller
{
    public function index(): JsonResponse
    {
        $classes = SchoolClass::withCount('students')
            ->latest()
            ->get();

        return response()->json([
            'data' => $classes,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'level' => ['required', 'string', 'max:255'],
            'major' => ['required', 'string', 'max:255'],
        ]);

        $class = SchoolClass::create($validated);

        return response()->json([
            'message' => 'Data kelas berhasil dibuat.',
            'data' => $class,
        ], 201);
    }

    public function show(SchoolClass $class): JsonResponse
    {
        $class->load(['students' => fn ($query) => $query->orderBy('name')])
            ->loadCount('students');

        return response()->json([
            'data' => $class,
        ]);
    }

    public function update(Request $request, SchoolClass $class): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'level' => ['required', 'string', 'max:255'],
            'major' => ['required', 'string', 'max:255'],
        ]);

        $class->update($validated);

        return response()->json([
            'message' => 'Data kelas berhasil diperbarui.',
            'data' => $class,
        ]);
    }

    public function destroy(SchoolClass $class): JsonResponse
    {
        $class->delete();

        return response()->json([
            'message' => 'Data kelas berhasil dihapus.',
        ]);
    }
}
