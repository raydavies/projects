<?php

class DbResult
{
	protected $result;
	
	public function __construct($result)
	{
		$this->result = $result;
	}
	
	public function getAffectedRows()
	{
		return $this->getResult()->num_rows;
	}
	
	public function fetchAssoc()
	{
		return $this->getResult()->fetch_assoc();
	}
	
	public function freeResult()
	{
		$this->getResult()->free_result();
	}
	
	public function getResult()
	{
		return $this->result;
	}
}
