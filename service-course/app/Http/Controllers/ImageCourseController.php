<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\ImageCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ImageCourseController extends Controller
{
    public function create(Request $request)
    {
        $rules = [
            'image' => 'required|url',
            'course_id' => 'required|integer'
        ];
        $data = $request->all();
        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 422);
        }

        $courseId = $request->input('course_id');
        $course = Course::find($courseId);
        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        $imageCourse = ImageCourse::create($data);

        return response()->json([
            'message' => 'Image course created successfully',
            'data' => $imageCourse
        ], 201);
    }

    public function destroy($id){
        $imageCourse = ImageCourse::find($id);
        if (!$imageCourse) {
            return response()->json(['error' => 'Image course not found'], 404);
            }
            $imageCourse->delete();
            return response()->json(['message' => 'Image course deleted successfully'], 200);
    }
}
