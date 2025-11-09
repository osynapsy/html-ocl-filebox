<?php
namespace Osynapsy\Ocl\FileBox\Action;

use Osynapsy\Action\AbstractAction;

/**
 * Description of Upload
 *
 * @author Pietro Celeste <p.celeste@qanda.cc>
 */
class BaseUpload extends AbstractAction
{
    protected function ensureUploadDirectory($uploadRoot)
    {
        $documentRoot = rtrim($_SERVER['DOCUMENT_ROOT'], '/');
        $dir = $documentRoot . '/' . ltrim($uploadRoot, '/');

        // Prova a creare la directory se non esiste
        if (!is_dir($dir) && !@mkdir($dir, 0775, true)) {
            $this->raiseException(sprintf('Cannot create directory: %s', $dir));
        }

        // Controlla che sia scrivibile
        if (!is_writable($dir)) {
            $this->raiseException(sprintf('Directory is not writable: %s', $dir));
        }

        return $dir; // opzionale: restituisce il path completo
    }
    
    protected function getMineType($absFilePath)
    {
        $mine = new \finfo(\FILEINFO_MIME_TYPE);
        return $mine->file($absFilePath);
    }
    
    protected function getFileExtension($absFilePath)
    {
        $pathinfo = pathinfo($absFilePath);
        return $pathinfo['extension'];
    }
}
