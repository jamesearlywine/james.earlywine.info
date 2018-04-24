<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class rekeyEntries extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'zApp:rekeyEntries';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Re-key Entries';

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

		$entries = Entry::all();
	
		foreach ($entries as $entry) {
			echo PHP_EOL . "Generating new api keys for entry #" . $entry->id;
			$entry->rekey();
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
