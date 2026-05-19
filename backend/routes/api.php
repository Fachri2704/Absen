<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\SchoolClassController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/ping', function () {
    return response()->json([
        'message' => 'API Laravel berhasil terhubung',
    ]);
});

Route::apiResource('classes', SchoolClassController::class);
Route::apiResource('students', StudentController::class);

Route::post('attendances/bulk', [AttendanceController::class, 'bulkStore']);
Route::apiResource('attendances', AttendanceController::class);