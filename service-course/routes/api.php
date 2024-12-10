<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\ChatperController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Mentor
Route::get('mentors', [MentorController::class, 'index']);
Route::get('mentors/{id}', [MentorController::class, 'show']);
Route::post('mentors', [MentorController::class, 'create']);
Route::put('mentors/{id}', [MentorController::class, 'update']);
Route::delete('mentors/{id}', [MentorController::class, 'destroy']);

// Course
Route::get('courses', action: [CourseController::class, 'index']);
Route::post('courses', [CourseController::class, 'create']);
Route::put('courses/{id}', [CourseController::class, 'update']);
Route::delete('courses/{id}', [CourseController::class, 'destroy']);

// Chapter
Route::get('chapters', [ChatperController::class, 'index']);
Route::get('chapters/{id}', [ChatperController::class, 'show']);
Route::post('chapters', [ChatperController::class, 'create']);
Route::put('chapters/{id}', [ChatperController::class, 'update']);
Route::delete('chapters/{id}', [ChatperController::class, 'destroy']);

// Lessons
Route::get('lessons', [LessonController::class, 'index']);
Route::get('lessons/{id}', [LessonController::class, 'show']);
Route::post('lessons', [LessonController::class, 'create']);
Route::put('lessons/{id}', [LessonController::class, 'update']);
Route::delete('lessons/{id}', [LessonController::class, 'destroy']);



