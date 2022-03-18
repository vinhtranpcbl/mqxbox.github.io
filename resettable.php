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
$sql = "DROP TABLE datatb";
if ($conn->query($sql) === TRUE) {
	$sql = "CREATE TABLE datatb(
		id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
		device_id VARCHAR(10) NOT NULL,
		value1 VARCHAR(10) NOT NULL,
		value2 VARCHAR(10) NOT NULL,
		value3 VARCHAR(10) NOT NULL,
		value4 VARCHAR(10) NOT NULL,
		sample_time TIMESTAMP NOT NULL
	)";
	if ($conn->query($sql) === TRUE) {
		echo 'Reset your table completed!';
	}else{
		echo "Error: " . $sql . "<br>" . $conn->error;
	}
} else {
	echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();
