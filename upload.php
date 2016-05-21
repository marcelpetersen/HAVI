<?php
header("Access-Control-Allow-Origin: *");




$var = $HTTP_RAW_POST_DATA;

$json = json_decode($var);



$var = $json->image;
$user = $json->user;


$var = file_get_contents($var);

$user = (string)$user;

if (!file_exists("../web/uploads/" . $user)) {
    mkdir("uploads/".$user);
}
$uploadDir = "uploads/" . $user . "/";

if($var && $user){
	define('UPLOAD_DIR', $uploadDir);
	// md5 file
	$id = md5($var);
	$file = UPLOAD_DIR . $id . '.jpeg';
	$success = file_put_contents($file, $var);
	print $success ? $user . '/' . $id : 'Unable to save the file.';
    
}else {
    echo 'Fout:geen file';
}
?>