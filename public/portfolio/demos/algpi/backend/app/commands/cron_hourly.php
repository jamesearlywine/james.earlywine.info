<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class cron_hourly extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'zApp:cron_hourly';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Executes the cron-related hourly tasks for this app.';

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
	
		$this->call('zApp:logNewVotes');
		$this->call('zApp:removeOrphanedAssets');
		
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
