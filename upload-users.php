<?php
header("Access-Control-Allow-Origin: *");

$var = $HTTP_RAW_POST_DATA;
$var = json_decode($var);
$var = $var->image;
$var = file_get_contents($var);

if($var){
	define('UPLOAD_DIR', 'users/');
	// md5 file
	$id = md5($var);
	$file = UPLOAD_DIR . $id . '.jpeg';
	$success = file_put_contents($file, $var);
	print $success ? $id : 'Unable to save the file.';
    
}else {
    echo 'Fout:geen file';
}
?>