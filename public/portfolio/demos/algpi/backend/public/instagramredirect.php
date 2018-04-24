<?php
header("Location: index.php/instagram/redirect?user_api_key=" . $_GET['user_api_key'] . "&code=" . $_GET['code']);
//echo json_encode($_GET);
?>