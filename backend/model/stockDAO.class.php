<?php
require_once(__DIR__ . '/stock.class.php');
require_once(__DIR__ . '/medicament.class.php');
require_once(__DIR__ . '/dal.class.php');

class StockDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }



}