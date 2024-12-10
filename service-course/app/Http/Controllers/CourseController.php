<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Mentor;
use App\Models\Review;
use App\Models\Chapter;
use App\Models\MyCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{

    public function index(Request $request){
       
      
        // membuat list
        $courses = Course::query();

        // filter query params
        $q = $request->query('q');
        $status = $request->query('status');

        // search

        // search param dengan q
        $courses->when($q, function($query) use ($q){
            return $query->whereRaw("name LIKE '%".strtolower($q). "%'");
        });

        // status
        $courses->when($status, function($query) use ($status){
            return $query->where('status', $status);
        });

        // llist
        return response()->json([
            'status' => 'success',
            'data' => $courses->paginate(10)
        ]);

    }

    public function show($id){
        $course = Course::with('chapters.lessons', 'mentor', 'images')->find($id);

        if (!$course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Course not found'
                ], 404);
                }
        $reviews = Review::where('course_id', $id)->get()->toArray();
            // search userIDS
            if(count($reviews) > 0){
                    $userIds = array_column($reviews, 'user_id');

                    $users = getUserByIds($userIds);
                    // echo "<pre>".print_r($users, 1)."</pre>";
                    if ($users['status'] === 'error'){
                    $reviews = [ ];
                    } else {
                        foreach($reviews as $key => $review){
                            $userIndex = array_search($review['user_id'], array_column($users['data'], 'id'));
                            
                            $reviews[$key]['users'] = $users['data'][$userIndex];
                        }
                    }
                }; 

        // student  
        $totalStudent = MyCourse::where('course_id', $id)->count();

        // Videos
        $totalVideos = Chapter::where('course_id', $id)->withCount('lessons')->get()->toArray();
        $finalTotalVideos =array_sum(array_column($totalVideos, 'lessons_count'));
       
        // Output
        $course['reviews'] = $reviews;
        $course['totalVideos'] = $finalTotalVideos ;
        $course['totalStudent'] = $totalStudent;

        return response()->json([
        'status' => 'success',
        'data' => $course
        ]);

    }

    public function create(Request $request)
    {
        $rules = [
            'name' => 'required|string',
            'certificate' => 'required|boolean',
            'thumbnail' => 'string|url',
            'type' => 'required|in:free,premium',
            'status' => 'required|in:draft,published',
            'price' => 'integer',
            'description' => 'string',
            'level' => 'required|in:all-level,beginner,intermediate,advanced',
            'mentor_id' => 'required|integer'
        ];

        $data = $request->all();
        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }

        $mentorId = $request->input('mentor_id');
        $mentor = Mentor::find($mentorId);
        if (!$mentor) {
            return response()->json(['error' => 'Mentor not found'], 404);
        }

        $course = Course::create($data);
        return response()->json(['status' => 'success', 'data' => $course], 201);
    }

    public function update(Request $request, $id){
        $rules = [
            'name' => 'string',
            'certificate' => 'boolean',
            'thumbnail' => 'string|url',
            'type' => 'in:free,premium',
            'status' => 'in:draft,published',
            'price' => 'integer',
            'description' => 'string',
            'level' => 'in:all-level,beginner,intermediate,advanced',
            'mentor_id' => 'integer'
        ];

        $data = $request->all();
        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }

        $course = Course::find($id);
        if (!$course) {
            return response()->json([
                'status'=> 'error',
                'messages' => 'Course not found'], 404);
            }

            //check mentor id di input front end atau tidak 
            $mentorId = $request->input('mentor_id');
            // jika mentor id dikirim dari front end, mentor id ada atau tdk
            if($mentorId){
                $mentor = Mentor::find($mentorId);
                if (!$mentor) {
                    return response()->json(['error' => 'Mentor not found'], 404);
                    }
            }

            $course->fill($data);
            $course->save();
            return response()->json(['status' => 'success', 'data' => $course],
            200);
    }

    public function destroy($id){
        $course = Course::find($id);
        if (!$course) {
            return response()->json([
                'status'=> 'error',
                'messages' => 'Course not found'], 404);
                }
                $course->delete();
                return response()->json([
                    'status'=> 'success',
                    'messages' => 'Course deleted'], 200);
                }



    }

