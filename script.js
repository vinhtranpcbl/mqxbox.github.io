var data1 = {
    labels: [],
    datasets: [
        {
            label: 'Cảm biến số 1',
            data: [],
            borderColor: 'rgba(255, 0, 0, 0.8)',
            backgroundColor: 'rgba(255,0, 0, 0.7)',

        },
        {
            label: 'Cảm biến số 2',
            data: [],
            borderColor: 'rgba(255, 128, 0, 0.8)',
            backgroundColor: 'rgba(255, 128, 0, 0.7)',
        }
    ]
};
var data2 = {
    labels: [],
    datasets: [
        {
            label: 'Cảm biến số 1',
            data: [],
            borderColor: 'rgba(255, 0, 0, 0.8)',
            backgroundColor: 'rgba(255,0, 0, 0.7)',

        },
        {
            label: 'Cảm biến số 2',
            data: [],
            borderColor: 'rgba(255, 128, 0, 0.8)',
            backgroundColor: 'rgba(255, 128, 0, 0.7)',
        }
    ]
};
var data3 = {
    labels: [],
    datasets: [
        {
            label: 'Cảm biến số 1',
            data: [],
            borderColor: 'rgba(255, 0, 0, 0.8)',
            backgroundColor: 'rgba(255,0, 0, 0.7)',

        },
        {
            label: 'Cảm biến số 2',
            data: [],
            borderColor: 'rgba(255, 128, 0, 0.8)',
            backgroundColor: 'rgba(255, 128, 0, 0.7)',
        }
    ]
};
var config1 = {
    type: 'line',
    data: data1,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
                font: {
                    size: 20
                }
            },

        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Thời gian trong ngày'
                }
            },
            y: {
                min: 25,
                max: 100,
                title: {
                    display: true,
                    text: 'Nhiệt độ °C'
                }
            }
        }
    },

};
var config2 = {
    type: 'line',
    data: data2,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
                font: {
                    size: 20
                }
            },

        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Thời gian trong ngày'
                }
            },
            y: {
                min: 25,
                max: 100,
                title: {
                    display: true,
                    text: 'Nhiệt độ °C'
                }
            }
        }
    },
    showTooltips: true,
};
var config3 = {
    type: 'line',
    data: data3,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
                font: {
                    size: 20
                }
            },

        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Thời gian trong ngày'
                }
            },
            y: {
                min: 25,
                max: 100,
                title: {
                    display: true,
                    text: 'Nhiệt độ °C'
                }
            }
        }
    },
};

function csv_click() {
    var date = document.getElementById("datePicker").value;
    var station = document.getElementById("station").value;

    var stringquery = `SELECT * FROM datatb WHERE device_id = '${station}' AND sample_time >= '${date} 00:00:00' AND sample_time < '${date} 23:59:59'`;
    let url = "database.php";
    let obj = {
        function: "extrude",
        query: stringquery
    };
    let json = JSON.stringify(obj);
    $.post(url, json, function (data, status) {
        csvmaker(station, date, data);
    });
}

function download(station, date, data) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    var filename = `Dữ liệu trạm số ${station} (${date}).csv`;
    a.setAttribute('download', filename);
    a.click()
}

function csvmaker(station, date, datas) {
    if (datas.length > 0) {
        csvRows = [];
        const headers = Object.keys(datas[0]);
        csvRows.push(headers.join(','));
        datas.forEach(data => {
            const values = Object.values(data).join(',');
            csvRows.push(values)
        });
        var csvdata = csvRows.join('\n')
        download(station, date, csvdata);
    } else {
        alert("Không có dữ liệu yêu cầu");
    }
}




function initChart(id, chart) {
    var stringquery = `SELECT * FROM datatb WHERE device_id = '${id}' AND sample_time >= '${search_daytime()} 00:00:00'`;
    let url = "./database.php";
    let obj = {
        function: "extrude",
        query: stringquery
    };
    let json = JSON.stringify(obj);
    $.post(url, json, function (data, status) {
        if (data.length > 0) {
            
            for (var i = 0; i < data.length; i++) {
                chart.data.labels.push(convertLabel(data[i].sample_time));
                chart.data.datasets[0].data.push(data[i].value1);
                chart.data.datasets[1].data.push(data[i].value2);
            }
            last_time[id - 1] = data[data.length - 1].sample_time;
            chart.options.plugins.title.text = `Đồ thị nhiệt độ trạm số ${id}, ${getDateTime()}`;
            document.getElementById(`station${id}`).innerHTML = `<i>Trạm số ${id}: (Cập nhật: ${last_time[id - 1]})</i>`;
            document.getElementById(`temp${id}1`).innerHTML = `${data[data.length - 1].value1}°C`;
            document.getElementById(`temp${id}2`).innerHTML = `${data[data.length - 1].value2}°C`;
            var note = [data[data.length - 1].value3, data[data.length - 1].value4];
            for (var i = 1; i <= 2; i++) {
                if (note[i - 1] === 'normal') {
                    document.getElementById(`note${id}${i}`).innerHTML = "<span style='color: black;'>Hoạt động ổn định</span>";
                } else if (note[i - 1] === 'over-load') {
                    document.getElementById(`note${id}${i}`).innerHTML = "<span style='color: red;'><b>Nhiệt độ tăng đột ngột</b></span>";
                } else if (note[i - 1] === 'alarm') {
                    document.getElementById(`note${id}${i}`).innerHTML = "<span style='color: red;'><b>Quá nhiệt</b></span>";
                } else {
                    document.getElementById(`note${id}${i}`).innerHTML = "<span style='color: red;'><b>Hoạt động ổn định</b></span>";
                }
            }
        } else {
            chart.options.plugins.title.text = `Đồ thị nhiệt độ trạm số ${id}`;
            document.getElementById(`station${id}`).innerHTML = `<i>Trạm số ${id}   (Không kết nối)</i>`;
        }
        chart.update();
    });
}
function updateChart(id, chart) {
    var stringquery = `SELECT * FROM datatb WHERE device_id = '${id}' AND sample_time > '${last_time[id - 1]}'`;
    let url = "./database.php";
    let obj = {
        function: "extrude",
        query: stringquery
    };
    //console.log(stringquery);
    let json = JSON.stringify(obj);
    $.post(url, json, function (data, status) {
        
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                chart.data.labels.push(convertLabel(data[i].sample_time));
                chart.data.datasets[0].data.push(data[i].value1);
                chart.data.datasets[1].data.push(data[i].value2);
            }
            last_time[id - 1] = data[data.length - 1].sample_time;
            // console.log(data);
            // console.log(data[data.length - 1].value1);
            // console.log(data[data.length - 1].value2);
            chart.options.plugins.title.text = `Đồ thị nhiệt độ trạm số ${id}, ${getDateTime()}`;
            document.getElementById(`station${id}`).innerHTML = `<i>Trạm số ${id}: (Cập nhật: ${last_time[id - 1]})</i>`;
            document.getElementById(`temp${id}1`).innerHTML = `${data[data.length - 1].value1}°C`;
            document.getElementById(`temp${id}2`).innerHTML = `${data[data.length - 1].value2}°C`;
            var note = [data[data.length - 1].value3, data[data.length - 1].value4];
            for (var i = 1; i <= 2; i++) {
                if (note[i - 1] === 'normal') {
                    document.getElementById(`note${id}${i}`).innerHTML = "<span style='color: black;'>Hoạt động ổn định</span>";
                } else if (note[i - 1] === 'over-load') {
                    document.getElementById(`note${id}${i}`).innerHTML = "<span style='color: red;'><b>Nhiệt độ tăng đột ngột</b></span>";
                } else if (note[i - 1] === 'alarm') {
                    document.getElementById(`note${id}${i}`).innerHTML = "<span style='color: red;'><b>Quá nhiệt</b></span>";
                } else {
                    document.getElementById(`note${id}${i}`).innerHTML = "<span style='color: red;'><b>Hoạt động ổn định</b></span>";
                }
            }
        } 
        chart.update();
    });
}
function search_daytime() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
}
function getDateTime() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return `ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
}
function convertLabel(time) {
    const sample_time = new Date(time);
    var min = sample_time.getMinutes();
    var hour = sample_time.getHours();
    var time = hour + ':' + min;
    return time;
}































// function updateChart(id, chart) {
//     // var ltime = Math.floor(new Date(last_time[id-1]).getTime() );
//     var text_id = `station${id}`;
//     var text = document.getElementById(text_id);
//     var ltime = String(last_time[id - 1]);
//     var params = {
//         TableName: `TrackingTB${id}`,
//         KeyConditionExpression: "device_id = :a and sample_time > :d",
//         ExpressionAttributeValues: {
//             ":a": id,
//             ":d": ltime,
//         },
//     };
//     var docClient = new AWS.DynamoDB.DocumentClient();
//     docClient.query(params, function (err, data) {
//         if (err) {
//             console.log(err);
//         } else {
//             chart.options.plugins.title.text = `Đồ thị nhiệt độ trạm số ${id}`;
//             var device_data = dataParse(data);
//             if (device_data[0].length <= 0) {

//             } else {
//                 // console.log(`Last time next: ${ltime}`);
//                 // console.log(`Data (${id}): ${device_data}`);
//                 for (var i = 0; i < device_data[0].length; i++) {
//                     chart.data.labels.push(convertLabel(device_data[0][i]));
//                     chart.data.datasets[0].data.push(device_data[2][i]);
//                     chart.data.datasets[1].data.push(device_data[3][i]);
//                     chart.update();
//                 }
//                 var endpoint = device_data[1].length - 1;
//                 last_time[id - 1] = device_data[1][endpoint];
//                 text.innerHTML = `<i>Trạm số ${id}: (Cập nhật: ${convertDateTime(device_data[0][endpoint])})</i>`;

//                 //
//                 //las_temp[id - 1] = [device_data[2][endpoint], device_data[2][endpoint]];
//                 if (device_data[2][endpoint] - las_temp[id - 1][0] >= 3) {
//                     //document.getElementById(`note${id}1`).innerHTML = "<b>Quá nhiệt</b>";
//                     document.getElementById(`note${id}1`).innerHTML = "<span style='color: red;'><b>Quá nhiệt</b></span>";
//                 } else {
//                     //document.getElementById(`note${id}1`).innerHTML = "Hoạt động ổn định";
//                     document.getElementById(`note${id}1`).innerHTML = "<span style='color: black;'>Hoạt động ổn định</span>";
//                 }
//                 if (device_data[3][endpoint] - las_temp[id - 1][1] >= 3) {
//                     //document.getElementById(`note${id}2`).innerHTML = "<b>Quá nhiệt</b>";
//                     document.getElementById(`note${id}2`).innerHTML = "<span style='color: red;'><b>Quá nhiệt</b></span>";
//                 } else {
//                     //document.getElementById(`note${id}2`).innerHTML = "Hoạt động ổn định";
//                     document.getElementById(`note${id}2`).innerHTML = "<span style='color: black;'>Hoạt động ổn định</span>";
//                 }
//                 document.getElementById(`temp${id}1`).innerHTML = `${device_data[2][endpoint]}°C`;
//                 document.getElementById(`temp${id}2`).innerHTML = `${device_data[3][endpoint]}°C`;
//                 las_temp[id - 1] = [device_data[2][endpoint], device_data[3][endpoint]];
//                 //
//             }
//         }
//     });
// }
// function initChart(id, chart) {
//     var text_id = `station${id}`;
//     var text = document.getElementById(text_id);
//     var first_timp = Math.floor(new Date(getFirstTime()).getTime() / 1000);
//     var params = {
//         TableName: `TrackingTB${id}`,
//         KeyConditionExpression: "device_id = :a and sample_time > :d",
//         ExpressionAttributeValues: {
//             ":a": id,
//             ":d": String(first_timp),
//         },
//         // Limit: 300,
//     };
//     var docClient = new AWS.DynamoDB.DocumentClient();
//     docClient.query(params, function (err, data) {
//         if (err) {
//             console.log(err);
//             chart.options.plugins.title.text = `Đồ thị nhiệt độ trạm số ${id}`;
//             chart.update();
//             text.innerHTML = `<i>Trạm số ${id}   (Không kết nối)</i>`;
//         } else {
//             chart.options.plugins.title.text = `Đồ thị nhiệt độ trạm số ${id}`;
//             var device_data = dataParse(data);
//             if (device_data[0].length <= 0) {
//                 text.innerHTML = `<i>Trạm số ${id} (Không có dữ liệu)</i>`;
//             } else {
//                 var labels = convertLabels(device_data[0]);
//                 chart.data.labels = labels;
//                 var count = 2;
//                 chart.data.datasets.forEach(dataset => {
//                     dataset.data = device_data[count++];
//                     chart.update();
//                 });
//                 var endpoint = device_data[1].length - 1;
//                 last_time[id - 1] = device_data[1][endpoint];
//                 text.innerHTML = `<i>Trạm số ${id}: (Cập nhật: ${convertDateTime(device_data[0][endpoint])})</i>`;
//                 console.log(`1. Last time init (id = ${id}): ${last_time[id - 1]}`);
//                 // Show notes
//                 las_temp[id - 1] = [device_data[2][endpoint], device_data[3][endpoint]];
//                 console.log(`ID (${id}), last temp: ${las_temp[id - 1]}`);


//                 if (device_data[0].length > 1) {
//                     //
//                     if (checkTimeSpace(device_data[0][endpoint - 1], device_data[0][endpoint], 5)) {
//                         if (device_data[2][endpoint] - device_data[2][endpoint - 1] >= 3) {
//                             //document.getElementById(`note${id}1`).innerHTML = "<b>Quá nhiệt</b>";
//                             document.getElementById(`note${id}1`).innerHTML = "<span style='color: red;'><b>Quá nhiệt</b></span>";
//                         } else {
//                             //document.getElementById(`note${id}1`).innerHTML = "Hoạt động ổn định";
//                             document.getElementById(`note${id}1`).innerHTML = "<span style='color: black;'>Hoạt động ổn định</span>";
//                         }
//                         if (device_data[3][endpoint] - device_data[3][endpoint - 1] >= 3) {
//                             //document.getElementById(`note${id}2`).innerHTML = "<b>Quá nhiệt</b>";
//                             document.getElementById(`note${id}2`).innerHTML = "<span style='color: red;'><b>Quá nhiệt</b></span>";
//                         } else {
//                             //document.getElementById(`note${id}2`).innerHTML = "Hoạt động ổn định";
//                             document.getElementById(`note${id}2`).innerHTML = "<span style='color: black;'>Hoạt động ổn định</span>";
//                         }
//                     } else {
//                         document.getElementById(`note${id}1`).innerHTML = "<span style='color: black;'>Hoạt động ổn định</span>";
//                         document.getElementById(`note${id}2`).innerHTML = "<span style='color: black;'>Hoạt động ổn định</span>";
//                     }
//                     // 

//                 }
//                 document.getElementById(`temp${id}1`).innerHTML = `${device_data[2][endpoint]}°C`;
//                 document.getElementById(`temp${id}2`).innerHTML = `${device_data[3][endpoint]}°C`;
//             }
//         }
//     });
// }
// function checkTimeSpace(tim1, tim2, ofset) {
//     var timd1 = new Date(tim1);
//     var timd2 = new Date(tim2);
//     timd2.setMinutes(timd2.getMinutes() - ofset);

//     if (timd1 > timd2) { return true; }
//     else {
//         return false;
//     }
// }

// function convertLabels(timestamps) {
//     var labels = [];
//     timestamps.forEach(time => {
//         const sample_time = new Date(time);
//         var min = sample_time.getMinutes();
//         var hour = sample_time.getHours();
//         var time = hour + ':' + min;
//         labels.push(time);
//     });
//     return labels;
// }
// function timeCompare(t1, t2) {
//     var arr1 = t1.split(':');
//     var arr2 = t2.split(':');
//     var n1 = parseInt(arr1[0]) * 100 + parseInt(arr1[1]);
//     var n2 = parseInt(arr2[0]) * 100 + parseInt(arr2[1]);
//     return (n1 > n2) ? true : false;
// }
// function dataParse(data) {
//     var sample_time = [];
//     var timestamp = [];
//     var temperature1 = [];
//     var temperature2 = [];
//     for (let i = 0; i < data.Items.length; i++) {
//         var timestp = JSON.parse(data.Items[i].sample_time);
//         //get sample_time
//         const time = new Date(timestp);
//         sample_time.push(time);
//         timestamp.push(timestp);
//         temperature1.push(data.Items[i].device_data.temperature1);
//         temperature2.push(data.Items[i].device_data.temperature2);
//     }
//     return [sample_time, timestamp, temperature1, temperature2];
// }

function updateDateTime() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    date_time = document.getElementById("date_time");
    date_time.innerHTML = `Bạc Liêu, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()} ${time}`;
}
function getFirstTime() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var value = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;
    return value;
}
function convertDateTime(input) {
    var today = new Date(input);
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var value = `${time}, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
    return value;
}