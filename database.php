
<?php
function get_query($query)
{
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
function insert_query($query)
{
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"));
//extrude
if ($data->function == "extrude") {
    $results = get_query($data->query);
    echo $results;
}
if ($data->function == "insert") {
    $device_id = $data->device_id;
    $value1 = $data->value1;
    $value2 = $data->value2;
    $value3 = $data->value3;
    $value4 = $data->value4;

    date_default_timezone_set('Asia/Jakarta');
    $date = date("Y/m/d H:i:s");

    $sql = "INSERT INTO datatb (device_id, value1, value2, value3, value4, sample_time) VALUES ('" . $device_id . "', '" . $value1 . "', '" . $value2 . "', '" . $value3 . "', '" . $value4 . "', '" . $date . "')";
    $results = insert_query($sql);
    echo $results;
}
?> 