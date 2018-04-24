<?php


class User extends Eloquent {
    protected $fillable = array(
        'api_key'  
    );
    protected $hidden = array(
        'id',
        'created_at',
        'updated_at'
    );
    protected $guarded = array();

    
    public function makeVisible($key) {
        array_push($this->visible, $key);
        return $this;
    }
  
}