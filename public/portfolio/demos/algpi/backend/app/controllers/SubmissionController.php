<?php
use App\Models\GoogleSheet;

class SubmissionController extends \BaseController {


    public function __construct()
    {

    }

	public function getSubmitEntrySocial() 
	{
		$submission = (object) WhoAmI::universal();
		
		$existingEntry = Entry::where('email', '=', $submission->email)->first();
		if (empty($existingEntry)) {
			$googleResponse = GoogleSheet::send([
				'doc' 		=> 'entries',
				'data'		=> $submission
			]);
			
			Entry::create( (array) $submission );
		}

		return Response::json([
		//	'info' 				=> 'submited entry from social login',
			'submission'		=> $submission,
		//	'googleResponse'	=> $googleResponse
		]);
	}
	
	public function postSubmitEntryFormFill()
	{
		$submission = (object) Input::all();
		$submission->signin = 'formfill';
		
		$existingEntry = Entry::where('email', '=', $submission->email)->first();
		if (empty($existingEntry)) {
			$googleResponse = GoogleSheet::send([
				'doc' 		=> 'entries',
				'data'		=> $submission
			]);
			
			Entry::create( (array) $submission);
		}
		
		return Response::json([
		//	'info' 				=> 'submited entry from formfill',
			'submission'		=> $submission,
		//	'googleResponse'	=> $googleResponse
		]);
	}


}
