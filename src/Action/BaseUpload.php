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
    
    protected function hasThumbnailSupport(string $ext): bool
    {
        return in_array(strtolower($ext), ['pdf', 'jpg', 'jpeg', 'png', 'webp']);
    }
    
    protected function generateThumbnail(string $source, array $options = []): ?string
    {
        $ext = strtolower(pathinfo($source, PATHINFO_EXTENSION));
        $target = $source . '.thumbnail.jpeg';

        $width  = $options['width']  ?? 120;
        $height = $options['height'] ?? 160;

        try {
            switch ($ext) {
                case 'pdf':
                    $im = new \Imagick($source . '[0]');
                    break;
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'webp':
                    $im = new \Imagick($source);
                    break;
                default:
                    return null; // tipo non supportato → ignora
            }

            $im->setImageFormat('jpeg');
            $im->thumbnailImage($width, $height, true);

            // Rimuovi eventuale trasparenza
            if ($im->getImageAlphaChannel()) {
                $im->setImageBackgroundColor('white');
                $im->setImageAlphaChannel(\Imagick::ALPHACHANNEL_REMOVE);
            }

            $im->writeImage($target);
            $im->clear();
            $im->destroy();

            return $target;
        } catch (\Throwable $e) {
            error_log("Thumbnail generation failed for $source: " . $e->getMessage());
            return null;
        }
    }

}
