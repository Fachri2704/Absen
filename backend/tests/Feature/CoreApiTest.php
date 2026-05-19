<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CoreApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_core_api_flow_can_manage_classes_students_and_attendances(): void
    {
        $classResponse = $this->postJson('/api/classes', [
            'name' => 'X RPL 1',
            'level' => 'X',
            'major' => 'RPL',
        ]);

        $classResponse
            ->assertCreated()
            ->assertJsonPath('data.name', 'X RPL 1');

        $classId = $classResponse->json('data.id');

        $studentResponse = $this->postJson('/api/students', [
            'class_id' => $classId,
            'name' => 'Budi Santoso',
            'nis' => '2026001',
            'gender' => 'male',
            'address' => 'Jl. Melati',
            'phone' => '08123456789',
        ]);

        $studentResponse
            ->assertCreated()
            ->assertJsonPath('data.school_class.id', $classId);

        $studentId = $studentResponse->json('data.id');

        $attendanceResponse = $this->postJson('/api/attendances', [
            'student_id' => $studentId,
            'class_id' => $classId,
            'date' => '2026-05-11',
            'status' => 'Hadir',
            'note' => 'Tepat waktu',
        ]);

        $attendanceResponse
            ->assertCreated()
            ->assertJsonPath('data.status', 'Hadir');

        $this->postJson('/api/attendances', [
            'student_id' => $studentId,
            'class_id' => $classId,
            'date' => '2026-05-11',
            'status' => 'Sakit',
        ])->assertUnprocessable();

        $this->postJson('/api/attendances/bulk', [
            'class_id' => $classId,
            'date' => '2026-05-11',
            'attendances' => [
                [
                    'student_id' => $studentId,
                    'status' => 'Sakit',
                    'note' => 'Izin dokter',
                ],
            ],
        ])
            ->assertOk()
            ->assertJsonPath('data.0.status', 'Sakit');

        $this->assertDatabaseHas('attendances', [
            'student_id' => $studentId,
            'class_id' => $classId,
            'date' => '2026-05-11',
            'status' => 'Sakit',
        ]);
    }

    public function test_class_level_and_major_must_use_available_options(): void
    {
        $this->postJson('/api/classes', [
            'name' => 'X XXX 1',
            'level' => 'XXX',
            'major' => 'XXX',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['level', 'major']);
    }
}
