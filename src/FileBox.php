<?php
namespace Osynapsy\Ocl\FileBox;

use Osynapsy\Html\Component;
use Osynapsy\Html\Tag;

/**
 * Description of FileBox
 *
 * @author Pietro Celeste <p.celeste@osynapsy.net>
 */
class FileBox extends Component
{
    protected $label = 'Trascina qui i tuoi file o clicca per selezionare';

    public function __construct($id = null)
    {
        parent::__construct('div', $id);
        $this->addClass('ocl-filebox');
        $this->requireCss('css/style.css');
        $this->requireJs('js/script.js');

    }

    public function preBuild()
    {
        $this->add($this->label);
        $this->add(new Tag('input'))->attribute('type', 'file')->attribute('multiple', 'multiple');
        $this->add(new Tag('div', null, 'file-list'));
        parent::preBuild();
    }

    public function setLabel($label)
    {
        $this->label = $label;
    }
}
