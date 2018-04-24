<?php

use Kalnoy\Cruddy\Schema\BaseSchema;
use Kalnoy\Cruddy\Service\Validation\FluentValidator;

class EntrySchema extends BaseSchema {

    protected $model = 'Entry';
    protected $perPage = 250;
    
    public function toString($record)
    {
        $approved = $record->is_approved ? 'approved' : 'not approved';
        return $record->id 
                . ' - ' . $record->title 
                . ' ' . $record->description 
                . ' ('
                . $approved
                . ')'
        ;
    }
    
    /**
     * The name of the column that is used to convert a model to a string.
     *
     * @var string
     */
    protected $titleAttribute = null;

    /**
     * The name of the column that will sort data by default.
     *
     * @var string
     */
    protected $defaultOrder = null;

    /**
     * * Define some fields.
     *
     * @param \Kalnoy\Cruddy\Schema\Fields\InstanceFactory $schema
     */
    public function fields($schema)
    {
        $schema->increments('id');
        $schema->text('admin_api_key')->disable();
        $schema->text('api_key')->disable();
        //$schema->timestamps();
        $schema->text('description');
        $schema->string('school_name');
        $schema->string('contact_name');
        $schema->string('email');
        $schema->boolean('is_approved');
        $schema->boolean('is_rejected');
        $schema->text('reject_reason');
        $schema->relates('polls', 'polls');
        $schema->embed('photo', 'photos');
        $schema->embed('video', 'videos');
        $schema->embed('photoGallery', 'photoGalleries');
    }

    /**
     * Define some columns.
     *
     * @param \Kalnoy\Cruddy\Schema\Columns\InstanceFactory $schema
     */
    public function columns($schema)
    {
        $schema->col('id');
        //$schema->col('created_at')->reversed();
        $schema->col('description')->format('Plain');
        $schema->col('school_name');
        $schema->col('contact_name');
        $schema->col('email');
    }

    /**
     * Define some files to upload.
     *
     * @param \Kalnoy\Cruddy\Repo\Stub $repo
     */
    public function files($repo)
    {
        
    }

    /**
     * Define validation rules.
     *
     * @param \Kalnoy\Cruddy\Service\Validation\FluentValidator $v
     */
    public function rules($v)
    {
        $v->always(
        [

        ]);
    }
}