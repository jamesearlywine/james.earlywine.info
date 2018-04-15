<?php

/* if apache module xsendfile was installed we could so this
    header("X-Sendfile: $file_name");
*/
$file = '../couponsPrint/kk-ticket-web.jpg';
if (file_exists($file)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename=kentuckykingdom_coupon.jpg');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($file));
    readfile($file);
} else {
    echo PHP_EOL . "That file does not exist.";
}
