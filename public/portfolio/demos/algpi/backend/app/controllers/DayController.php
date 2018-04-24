<?php
use Carbon\Carbon;

class DayController extends \BaseController {


    public function __construct()
    {

    }

	public function getDayNumber() 
	{
		
		$configDaysStart = Config::get('days.start');
		
		$start	= Carbon::createFromFormat( 'Y-m-d', $configDaysStart );
		$now	= Carbon::now('America/Indiana/Indianapolis');
		
		$daysElapsed = $start->diffInDays($now, false);
		if ($daysElapsed < 0) {$daysElapsed = 0;}
		
		$dayNumber = $daysElapsed + 1;
		
		return Response::json([
			// 'configDaysStart' => $configDaysStart,
			// 'start'			=> $start,
			// 'now'			=> $now,
			// 'daysElapsed'	=> $daysElapsed,
			'dayNumber' 	=> $dayNumber
		]);
	}
	
	
}
