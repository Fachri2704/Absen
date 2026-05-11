<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AttendanceController extends Controller
{
    private const STATUSES = ['Hadir', 'Sakit', 'Izin', 'Alpa', 'Telat'];

    public function index(Request $request): JsonResponse
    {
        $attendances = Attendance::with(['student.schoolClass', 'schoolClass'])
            ->when($request->filled('student_id'), function ($query) use ($request) {
                $query->where('student_id', $request->integer('student_id'));
            })
            ->when($request->filled('class_id'), function ($query) use ($request) {
                $query->where('class_id', $request->integer('class_id'));
            })
            ->when($request->filled('date'), function ($query) use ($request) {
                $query->whereDate('date', $request->date('date')->format('Y-m-d'));
            })
            ->when($request->filled('start_date'), function ($query) use ($request) {
                $query->whereDate('date', '>=', $request->date('start_date')->format('Y-m-d'));
            })
            ->when($request->filled('end_date'), function ($query) use ($request) {
                $query->whereDate('date', '<=', $request->date('end_date')->format('Y-m-d'));
            })
            ->latest('date')
            ->latest('id')
            ->get();

        return response()->json([
            'data' => $attendances,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'class_id' => ['required', 'integer', 'exists:classes,id'],
            'date' => ['required', 'date'],
            'status' => ['required', Rule::in(self::STATUSES)],
            'note' => ['nullable', 'string'],
        ]);

        $this->validateStudentClass($validated['student_id'], $validated['class_id']);
        $this->validateUniqueAttendance($validated['student_id'], $validated['date']);

        $attendance = Attendance::create($validated)->load(['student.schoolClass', 'schoolClass']);

        return response()->json([
            'message' => 'Data absensi berhasil dibuat.',
            'data' => $attendance,
        ], 201);
    }

    public function show(Attendance $attendance): JsonResponse
    {
        return response()->json([
            'data' => $attendance->load(['student.schoolClass', 'schoolClass']),
        ]);
    }

    public function update(Request $request, Attendance $attendance): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'class_id' => ['required', 'integer', 'exists:classes,id'],
            'date' => ['required', 'date'],
            'status' => ['required', Rule::in(self::STATUSES)],
            'note' => ['nullable', 'string'],
        ]);

        $this->validateStudentClass($validated['student_id'], $validated['class_id']);
        $this->validateUniqueAttendance($validated['student_id'], $validated['date'], $attendance->id);

        $attendance->update($validated);

        return response()->json([
            'message' => 'Data absensi berhasil diperbarui.',
            'data' => $attendance->load(['student.schoolClass', 'schoolClass']),
        ]);
    }

    public function destroy(Attendance $attendance): JsonResponse
    {
        $attendance->delete();

        return response()->json([
            'message' => 'Data absensi berhasil dihapus.',
        ]);
    }

    public function bulkStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'class_id' => ['required', 'integer', 'exists:classes,id'],
            'date' => ['required', 'date'],
            'attendances' => ['required', 'array', 'min:1'],
            'attendances.*.student_id' => ['required', 'integer', 'distinct', 'exists:students,id'],
            'attendances.*.status' => ['required', Rule::in(self::STATUSES)],
            'attendances.*.note' => ['nullable', 'string'],
        ]);

        $studentIds = collect($validated['attendances'])->pluck('student_id')->all();
        $studentCount = Student::where('class_id', $validated['class_id'])
            ->whereIn('id', $studentIds)
            ->count();

        if ($studentCount !== count($studentIds)) {
            abort(422, 'Semua siswa yang diabsen harus berada di kelas yang dipilih.');
        }

        DB::transaction(function () use ($validated): void {
            foreach ($validated['attendances'] as $attendance) {
                Attendance::updateOrCreate(
                    [
                        'student_id' => $attendance['student_id'],
                        'date' => $validated['date'],
                    ],
                    [
                        'class_id' => $validated['class_id'],
                        'status' => $attendance['status'],
                        'note' => $attendance['note'] ?? null,
                    ],
                );
            }
        });

        $attendances = Attendance::with(['student.schoolClass', 'schoolClass'])
            ->where('class_id', $validated['class_id'])
            ->whereDate('date', $validated['date'])
            ->orderBy('student_id')
            ->get();

        return response()->json([
            'message' => 'Data absensi berhasil disimpan.',
            'data' => $attendances,
        ]);
    }

    private function validateStudentClass(int $studentId, int $classId): void
    {
        $studentBelongsToClass = Student::whereKey($studentId)
            ->where('class_id', $classId)
            ->exists();

        if (! $studentBelongsToClass) {
            abort(422, 'Siswa tidak berada di kelas yang dipilih.');
        }
    }

    private function validateUniqueAttendance(string|int $studentId, string $date, ?int $ignoreId = null): void
    {
        $alreadyExists = Attendance::where('student_id', $studentId)
            ->whereDate('date', $date)
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists();

        if ($alreadyExists) {
            abort(422, 'Siswa ini sudah memiliki data absensi pada tanggal tersebut.');
        }
    }
}
