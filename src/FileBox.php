<?php
namespace Osynapsy\Ocl\FileBox;

use Osynapsy\Html\Component\AbstractComponent;
use Osynapsy\Html\Tag;

/**
 * Description of FileBox
 *
 * @author Pietro Celeste <p.celeste@osynapsy.net>
 */
class FileBox extends AbstractComponent
{
    const MIMETYPE_PDF = 'application/pdf';
    const MIMETYPE_XLS = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    protected $label = 'Trascina qui i tuoi file o clicca per selezionare';
    protected $multiple = false;

    public function __construct($id = null)
    {
        parent::__construct('div', $id);
        $this->addClass('ocl-filebox');
        $this->requireCss('ocl/filebox/style.css');
        $this->requireJs('ocl/filebox/script.js');
    }

    public function preBuild()
    {
        $this->add(new Tag('div', null, 'placeholder'))->add($this->label);
        $this->add(new Tag('input'))->attribute('name', $this->id . ($this->multiple ? '[]' : ''))->attribute('type', 'file');
        $this->add(new Tag('div', null, 'file-list'));
        $this->add(new Tag('div', null, 'add-icon'))->add('📎');
        parent::preBuild();
    }

    public function setLabel($label)
    {
        $this->label = $label;
        return $this;
    }

    public function setMultiple(bool $bool)
    {
        $this->attribute('data-multiple', $bool ? 'true' : 'false');
        $this->multiple = $bool;
        return $this;
    }

    public function setAccept(array $extensions)
    {
        $this->attribute('data-accept', implode(',', $extensions));
        return $this;
    }
}

