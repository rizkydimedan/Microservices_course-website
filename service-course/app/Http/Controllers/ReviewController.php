<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function create(Request $request)
    {
        $rules = [
            'user_id' => 'required|integer',
            'course_id' => 'required|integer',
            'rating' => 'required|integer|min:1|max:5',
            'note' => 'string',
        ];

        $data = $request->all();
        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->messages()
            ], 422);
        }

        $courseId = $request->input('course_id');
        $course = Course::find($courseId);
        if (!$course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Course not found'
            ], 404);
        }

        $userId = $request->input('user_id');
        $user = getUser($userId);
        if ($user['status'] === 'error') {
            return response()->json([
                'status' => $user['status'],
                'message' => $user['message']
            ], 404);
        }

        // cek apakah sudah pernah review
        $isExistReview = Review::where('course_id', '=', $courseId)->where('user_id', '=',$userId)->exists();

        if ($isExistReview) {
            return response()->json([
                'status' => 'error',
                'message' => 'You have already reviewed this course'
            ], 400);
        }

        $review = Review::create($data);
        return response()->json([
            'status' => 'success',
            'message' => 'Review created successfully',
            'data' => $review
        ], 201);
    }

    public function update(Request $request, $id){
        $rules = [
            'rating' => 'integer|min:1|max:5',
            'review' => 'string',
        ];

        // ambil semua data kecuali user dan course
        $data = $request->except('user_id', 'course_id');
        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->messages()
                ], 400);
                }
                // check id review in database
                $review = Review::find($id);
                if (!$review) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Review not found'
                        ], 404);
                    }
    
                        $review->update($data);
                        return response()->json([
                            'status' => 'success',
                            'message' => 'Review updated successfully',
                            'data' => $review
                            ], 200);
    }

    public function destroy($id){
        $review = Review::find($id);
        if (!$review) {
            return response()->json([
                'status' => 'error',
                'message' => 'Review not found'
                ], 404);
            }
            $review->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Review deleted successfully'
                ], 200);
                
    }
}
