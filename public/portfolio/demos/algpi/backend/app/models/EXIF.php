<?php

class EXIF {
    
    public static function fixUploadedFile($filename) {

        try {
            $exif = exif_read_data($filename);
        } catch (ErrorException $e) {
            return false;
        }
        if (!empty($exif['Orientation'])) {
            $image = imagecreatefromjpeg($filename);
            switch ($exif['Orientation']) {
                case 3:
                    $image = imagerotate($image, 180, 0);
                    break;
    
                case 6:
                    $image = imagerotate($image, -90, 0);
                    break;
    
                case 8:
                    $image = imagerotate($image, 90, 0);
                    break;
            }
    
            imagejpeg($image, $filename, 90);
        }
    }

}