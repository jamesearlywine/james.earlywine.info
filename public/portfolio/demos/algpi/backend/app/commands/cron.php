<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class cron extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'zApp:cron';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Executes the cron-related 30-second interval tasks for this app.';

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
		
		/*
		$timestart = time();
		// do some stuff immediately
			// ..
			$this->call('zApp:refreshApiCache');
			
		// do some stuff at 10 second interval (ie. wait)
		$elapsed = time() - $timestart;
		if ($elapsed < 10) {sleep(10 - $elapsed);}
			// ..
			$this->call('zApp:refreshApiCache');
			
		// do some stuff at 15 second interval
		$elapsed = time() - $timestart;
		if ($elapsed < 15) {sleep(15 - $elapsed);}
			// ..
		
		// do some stuff at 20 second interval
		$elapsed = time() - $timestart;
		if ($elapsed < 20) {sleep(20 - $elapsed);}
			// ..
			$this->call('zApp:refreshApiCache');
			
		// do some stuff at 30 second interval
		$elapsed = time() - $timestart;
		if ($elapsed < 30) {sleep(30 - $elapsed);}
			// ..
			$this->call('zApp:refreshApiCache');
			
		// do some stuff at 40 second interval
		$elapsed = time() - $timestart;
		if ($elapsed < 40) {sleep(40 - $elapsed);}
			// ..
			$this->call('zApp:refreshApiCache');
			
		// do some stuff at 40 second interval
		$elapsed = time() - $timestart;
		if ($elapsed < 45) {sleep(45 - $elapsed);}
			// ..		
			$this->call('zApp:refreshApiCache');
			
		// do some stuff at 50 second interval
		$elapsed = time() - $timestart;
		if ($elapsed < 50) {sleep(50 - $elapsed);}
			// ..
			$this->call('zApp:refreshApiCache');
		*/
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
