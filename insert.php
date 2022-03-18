<?php
$servername = "localhost";
$username = "quangvinh";
 $password = "1234567890";
$database = "temptrackingdb";
$conn = mysqli_connect($servername, $username, $password, $database);
// Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}
$value1 = rand(10, 100);
$value2 = rand(10, 100);
$value3 = "0";
$value4 = "0";

date_default_timezone_set('Asia/Jakarta');
$date = date("Y/m/d H:i:s");

$sql = "INSERT INTO datatb (device_id, value1, value2, value3, value4, sample_time) VALUES ('3', '" . $value1 . "', '" . $value2 . "', '" . $value3 . "', '" . $value4 . "', '" . $date . "')";
if ($conn->query($sql) === TRUE) {
	echo "New record created successfully";
} else {
	echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();
