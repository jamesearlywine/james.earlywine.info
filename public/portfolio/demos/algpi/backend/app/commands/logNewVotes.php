<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class logNewVotes extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'zApp:logNewVotes';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Log newly-received votes to S3 Bucket log';

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

		// s3 bucket config
		$baseUrl 	= Config::get('s3.base_url');
		$s3Bucket 	= Config::get('s3.s3Bucket');
		$s3Folder   = Config::get('s3.voteLog.s3Folder');
		$logFile	= Config::get('s3.voteLog.logFilename');
		$s3			= AWS::get('s3');
		$key  	= $s3Folder . '/' . $logFile;

		// pull the existing log from s3 bucket
			$uri = 'http://' . $s3Bucket . '.s3.amazonaws.com/' . $key;
			// echo PHP_EOL . 'S3 Existing Log URI: ' . $uri . PHP_EOL;
			
			function get_http_response_code($url) {
			    $headers = get_headers($url);
			    return substr($headers[0], 9, 3);
			}
			$logExists = ( ( (int) get_http_response_code($uri) ) < 400 );
			
			if ($logExists) {
				$existingVoteLog = file_get_contents($uri);
			} else {
				$existingVoteLog = null;
			}
			// echo PHP_EOL . 'Existing Log: ' . PHP_EOL . PHP_EOL . $existingLog . PHP_EOL . PHP_EOL;
		

		
		// get the new votes log
		$dataResponse 	= Vote::generateVoteLogForAllPolls();
		$newVoteLog 	= $dataResponse->log;
		$responses 		= $dataResponse->responses;
		
		// append the new votes
		$newLog = $existingVoteLog . $newVoteLog;

		// save and send to s3 bucket
		$s3->putObject(array(
			'Bucket' 	=> $s3Bucket,
			'Key'		=> $key,
			'Body'		=> $newLog,
			'ACL'    	=> 'public-read',
			'ContentType' => 'application/json'
		));
		
		// remove the votes from the database
		foreach ($dataResponse->responses as $response) {
			foreach ($response->votes as $vote) {
				echo PHP_EOL . 'Removing vote #' . $vote->id;
				$vote->delete();
			}
		}
		
		
		

		echo PHP_EOL . PHP_EOL . "Vote Logging Complete." . PHP_EOL . PHP_EOL;
		 
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
