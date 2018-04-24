<?php
$strDateTime    = '2016-01-01 5:00:01';
$datetime = DateTime::CreateFromFormat('Y-m-d H:i:s', $strDateTime, new DateTimeZone('UTC'));
echo PHP_EOL . "<br/>DateTime: " . $datetime->format( 'l, F jS, Y -- g:ia');
echo PHP_EOL . "<br/>Timezone Offset: " . $datetime->getOffset();


