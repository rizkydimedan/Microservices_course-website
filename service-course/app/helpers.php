

<?php
// <!-- add composer.json>> autoload -->
// <!-- "files": [
//             "app/helpers.php" ]-->
// Menguhungkan server port 8000 dan 5000 

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\RequestException;



// mengambil data user
if (!function_exists('getUser')) {
    function getUser($userId)
    {
        $url = env('SERVICE_USER_URL') . '/users/' . $userId;


        try {
            $response = Http::timeout(10)->get($url);
            $data = $response->json();
            $data['http_code'] = $response->getStatusCode();
            return $data;
        } catch (\Throwable $th) {
            return [
                'status' => 'error',
                'http_code' => 500,
                'message' => 'service user unavailable',
            ];
        }
    }
}


if (!function_exists('getUserByIds')) {
    // mengambill data user sesuai id dengan mengisi array id
    function getUserByIds($userIds = [])
    {
        $url = env('SERVICE_USER_URL') . '/users/';
        try {
            if (count($userIds) === 0) {
                return [
                    'status' => 'error',
                    'http_code' => 400,
                    'data' => [], //->array kosong
                    'message' => 'user id is required',
                ];
            }
            $response = Http::timeout(10)->get($url, ['user_ids[]' => $userIds]);
            $data = $response->json();
            $data['http_code'] = $response->getStatusCode();
            return $data;
        } catch (\Throwable $th) {
            return [
                'status' => 'erorr',
                'http_code' => 500,
                'message' => 'service user unavailable',
            ];
        }
    }
}
