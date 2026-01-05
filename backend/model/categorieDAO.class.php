<?php
class CategorieDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    
}