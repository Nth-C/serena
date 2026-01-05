<?php

class Stock
{
  public readonly array $medicaments;
  private StockDAO $dao;

  public function __construct(array $data = array())
  {
    $this->medicaments = $data['medicaments'] ?? array();
    $this->dao = new StockDAO();
  }

  public function __destruct()
  {
    $this->medicaments = null;
  }

  


  

}
