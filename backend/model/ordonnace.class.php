<?php

class Ordonnance extends Document
{
  public function __construct(array $data = array())
  {
    parent::__construct($data);
  }
  public function getOrdonnances(): array
  {
    return $this->dao->getOrdonnances($this);
  }
}
