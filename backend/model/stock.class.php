<?php

class Stock
{
  public readonly array $medicaments;

  public function __construct(array $data = array())
  {
    $this->medicaments = $data['medicaments'] ?? array();
  }

  public function __destruct()
  {
    $this->medicaments = null;
  }

  


  

}
