<?php
class StockDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }



}