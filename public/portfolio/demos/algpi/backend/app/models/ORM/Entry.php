<?php


class Entry extends Eloquent {
    protected $fillable = array(
        'email',
        'first_name',
        'last_name',
        'signin',
        'phone',
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