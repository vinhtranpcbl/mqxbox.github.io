<?php
function check_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
function get_query($query){
 $datatable =  array();
 $servername = "localhost";
 $username = "quangvinh";
 $password = "1234567890";
 $database = "temptrackingdb";
 $conn = mysqli_connect($servername, $username, $password, $database);
 if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
$result = $conn->query($query);
if ($result->num_rows > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $datatable[] = $row;
    }
}
$conn->close();
return json_encode($datatable);
}
function insert_query($query){
    $datatable =  array();
    $servername = "localhost";
    $username = "quangvinh";
    $password = "1234567890";
    $database = "temptrackingdb";
    $conn = mysqli_connect($servername, $username, $password, $database);
    if ($conn->query($query) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $query . "<br>" . $conn->error;
    }
    $conn->close();
}
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if(check_input($_GET["function"]) == 'insert'){
        $device_id =check_input($_GET["device_id"]) ;
        $value1 = check_input($_GET["value1"]) ;
        $value2 = check_input($_GET["value2"]) ;
        $value3 = check_input($_GET["value3"]) ;
        $value4 = check_input($_GET["value4"]) ;
        date_default_timezone_set('Asia/Jakarta');
        $date = date("Y/m/d H:i:s");

        $sql = "INSERT INTO datatb (device_id, value1, value2, value3, value4, sample_time) VALUES ('". $device_id ."', '". $value1 ."', '". $value2 ."', '". $value3 ."', '". $value4 ."', '". $date ."')";
        $results = insert_query($sql);
        echo $results;
    }

    if(check_input($_GET["function"]) == 'extrude'){
        $results = get_query($_GET["query"]);
        echo $results;
    }
}
