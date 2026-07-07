<?php

namespace JamstackVietnam\Contact\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JamstackVietnam\Contact\Models\Contact;
use JamstackVietnam\Core\Models\File;
use JamstackVietnam\Core\Traits\ApiResponse;

class ContactController extends Controller
{
    use ApiResponse;
    public $model = Contact::class;

    public function store(Request $request)
    {
        if (!$request->has('contact.data')) {
            return $this->empty();
        }
        $data = $request->input('contact')['data'];
        $requestData = $request->all()['contact'];
        $requestData['type'] = $requestData['type'] ?? key(config('contact.types'));
        $rules = config('contact.types.' . $requestData['type'] . '.rules');
        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            return $this->failure($validator->errors());
        }

        if (isset($requestData['data']['File CV'])) {
            $files = $requestData['data']['File CV'];
            $file = new File($request->input('path', '/'));

            $fileUploaded = $file->store($files);

            unset($requestData['data']['File CV']);

            $requestData['data']['File CV'] = [];

            if(isset($fileUploaded['successFiles'])) {
                foreach ($fileUploaded['successFiles'] as $item) {
                    $requestData['data']['File CV'][] = $item;
                }
            }
        }

        $contact = $this->model::create($requestData);

        return $this->success($contact);
    }
}

