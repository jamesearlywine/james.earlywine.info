<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class refreshApiCache extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'zApp:refreshApiCache';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Refresh the API Cache';

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
	}

	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function fire()
	{
		/**
		 * 	This command builds a table of queries that need to be run
		 * 		Runs those queries
		 * 			stores each one as a .json file in s3 bucket
		 */
			ini_set('display_errors', 1);
			ini_set('display_startup_errors', 1);
			error_reporting(E_ALL);

		// first define the static queries
		$routes = array(
			'backend/public/index.php/polls/currentWithEntriesAndCounts',
			'backend/public/index.php/polls/lastClosedWithEntriesAndCounts',
			'backend/public/index.php/polls/closed',
			'backend/public/index.php/polls/closedFinalists',
			
	 	);
		// next calculate the dynamic set of queries
		
			// poll summary for each poll
			$routeTemplate = 'backend/public/index.php/pollSummary/{pollId}';
			$polls = Poll::all();
			foreach ($polls as $key => $poll) {
				$route = str_replace('{pollId}', $poll->id, $routeTemplate);
				array_push($routes, $route);
			}
		
		// debug
		// echo PHP_EOL . "Detected Environment: " . Environment::$environment . PHP_EOL;
		// echo "Base url: " . Config::get('s3.base_url');
		// echo "Fetching these route/api query results: " . print_r($routes, true);
		
		// execute each query and save the result in S3 bucket
		$baseUrl 	= Config::get('s3.base_url');
		$s3Bucket 	= Config::get('s3.apiCache.s3Bucket');
		$s3Folder   = Config::get('s3.apiCache.s3Folder');
		$s3			= AWS::get('s3');
		
		// environment detection variables available
		// echo PHP_EOL . "SERVER: " . print_r($_SERVER, true) . PHP_EOL . PHP_EOL;
		
		foreach ($routes as $route) {
			$query = $baseUrl . '/' . $route;
			
			echo PHP_EOL . "Running this query: " . $query;

			$results = file_get_contents($query);
			
			echo PHP_EOL . "Saving results to S3Bucket..";
			$key = $s3Folder . '/' . $route;
			
			/*
			Log::info('Refreshing apiCache', 
						array('key' => $key)
			);
			*/
			
			$s3->putObject(array(
				'Bucket' 	=> $s3Bucket,
				'Key'		=> $key,
				'Body'		=> $results,
				'ACL'    	=> 'public-read',
				'ContentType' => 'application/json'
			));
		}
		
		echo PHP_EOL . PHP_EOL;
		 
	}

	/**
	 * Get the console command arguments.
	 *
	 * @return array
	 */
	protected function getArguments()
	{
		return array(
			// array('example', InputArgument::REQUIRED, 'An example argument.'),
		);
	}

	/**
	 * Get the console command options.
	 *
	 * @return array
	 */
	protected function getOptions()
	{
		return array(
			// array('example', null, InputOption::VALUE_OPTIONAL, 'An example option.', null),
		);
	}

}
