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
                    text: 'Thời gian trong ngày (time)'
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
                    text: 'Thời gian trong ngày (time)'
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
                    text: 'Thời gian trong ngày (time)'
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
AWS.config.update({
    region: "ap-northeast-1",
    endpoint: "http://dynamodb.ap-northeast-1.amazonaws.com",
    accessKeyId: "AKIAXKZISWAEZWPSCIVL",
    secretAccessKey: "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",
});
function updateChart(id, chart) {
    // var ltime = Math.floor(new Date(last_time[id-1]).getTime() );
    var text_id = `station${id}`;
    var text = document.getElementById(text_id);
    var ltime = String(last_time[id - 1]);
    var params = {
        TableName: `TrackingTB${id}`,
        KeyConditionExpression: "device_id = :a and sample_time > :d",
        ExpressionAttributeValues: {
            ":a": id,
            ":d": ltime,
        },
    };
    var docClient = new AWS.DynamoDB.DocumentClient();
    docClient.query(params, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            chart.options.plugins.title.text = `Đồ thị nhiệt độ trạm số ${id}`;
            var device_data = dataParse(data);
            if (device_data[0].length <= 0) {

            } else {
                // console.log(`Last time next: ${ltime}`);
                // console.log(`Data (${id}): ${device_data}`);
                for (var i = 0; i < device_data[0].length; i++) {
                    chart.data.labels.push(convertLabel(device_data[0][i]));
                    chart.data.datasets[0].data.push(device_data[2][i]);
                    chart.data.datasets[1].data.push(device_data[3][i]);
                    chart.update();
                }
                var endpoint = device_data[1].length - 1;
                last_time[id - 1] = device_data[1][endpoint];
                text.innerHTML = `<i>Trạm số ${id}: (Cập nhật: ${convertDateTime(device_data[0][endpoint])})</i>`;

                //
                //las_temp[id - 1] = [device_data[2][endpoint], device_data[2][endpoint]];
                if (device_data[2][endpoint] - las_temp[id - 1][0] >= 3) {
                    //document.getElementById(`note${id}1`).innerHTML = "<b>Quá nhiệt</b>";
                    document.getElementById(`note${id}1`).innerHTML = "<span style='color: red;'><b>Quá nhiệt</b></span>";
                } else {
                    //document.getElementById(`note${id}1`).innerHTML = "Hoạt động ổn định";
                    document.getElementById(`note${id}1`).innerHTML = "<span style='color: black;'>Hoạt động ổn định</span>";
                }
                if (device_data[3][endpoint] - las_temp[id - 1][1] >= 3) {
                    //document.getElementById(`note${id}2`).innerHTML = "<b>Quá nhiệt</b>";
                    document.getElementById(`note${id}2`).innerHTML = "<span style='color: red;'><b>Quá nhiệt</b></span>";
                } else {
                    //document.getElementById(`note${id}2`).innerHTML = "Hoạt động ổn định";
                    document.getElementById(`note${id}2`).innerHTML = "<span style='color: black;'>Hoạt động ổn định</span>";
                }
                document.getElementById(`temp${id}1`).innerHTML = `${device_data[2][endpoint]}°C`;
                document.getElementById(`temp${id}2`).innerHTML = `${device_data[3][endpoint]}°C`;
                las_temp[id - 1] = [device_data[2][endpoint], device_data[3][endpoint]];
                //
            }
        }
    });
}
function initChart(id, chart) {
    var text_id = `station${id}`;
    var text = document.getElementById(text_id);
    var first_timp = Math.floor(new Date(getFirstTime()).getTime() / 1000);
    var params = {
        TableName: `TrackingTB${id}`,
        KeyConditionExpression: "device_id = :a and sample_time > :d",
        //KeyConditionExpression: "device_id = :a",
        ExpressionAttributeValues: {
            ":a": id,
            ":d": String(first_timp),
        },
        // Limit: 300,
    };
    var docClient = new AWS.DynamoDB.DocumentClient();
    docClient.query(params, function (err, data) {
        if (err) {
            console.log(err);
            chart.options.plugins.title.text = `Đồ thị nhiệt độ trạm số ${id}`;
            chart.update();
            text.innerHTML = `<i>Trạm số ${id}   (Không kết nối)</i>`;
        } else {
            chart.options.plugins.title.text = `Đồ thị nhiệt độ trạm số ${id}`;
            var device_data = dataParse(data);
            if (device_data[0].length <= 0) {
                text.innerHTML = `<i>Trạm số ${id} (Không có dữ liệu)</i>`;
            } else {
                var labels = convertLabels(device_data[0]);
                chart.data.labels = labels;
                var count = 2;
                chart.data.datasets.forEach(dataset => {
                    dataset.data = device_data[count++];
                    chart.update();
                });
                var endpoint = device_data[1].length - 1;
                last_time[id - 1] = device_data[1][endpoint];
                text.innerHTML = `<i>Trạm số ${id}: (Cập nhật: ${convertDateTime(device_data[0][endpoint])})</i>`;
                console.log(`1. Last time init (id = ${id}): ${last_time[id - 1]}`);
                // Show notes
                las_temp[id - 1] = [device_data[2][endpoint], device_data[3][endpoint]];
                console.log(`ID (${id}), last temp: ${las_temp[id - 1]}`);


                if (device_data[0].length > 1) {
                    //
                    if (checkTimeSpace(device_data[0][endpoint - 1], device_data[0][endpoint], 5)) {
                        if (device_data[2][endpoint] - device_data[2][endpoint - 1] >= 3) {
                            //document.getElementById(`note${id}1`).innerHTML = "<b>Quá nhiệt</b>";
                            document.getElementById(`note${id}1`).innerHTML = "<span style='color: red;'><b>Quá nhiệt</b></span>";
                        } else {
                            //document.getElementById(`note${id}1`).innerHTML = "Hoạt động ổn định";
                            document.getElementById(`note${id}1`).innerHTML = "<span style='color: black;'>Hoạt động ổn định</span>";
                        }
                        if (device_data[3][endpoint] - device_data[3][endpoint - 1] >= 3) {
                            //document.getElementById(`note${id}2`).innerHTML = "<b>Quá nhiệt</b>";
                            document.getElementById(`note${id}2`).innerHTML = "<span style='color: red;'><b>Quá nhiệt</b></span>";
                        } else {
                            //document.getElementById(`note${id}2`).innerHTML = "Hoạt động ổn định";
                            document.getElementById(`note${id}2`).innerHTML = "<span style='color: black;'>Hoạt động ổn định</span>";
                        }
                    } else {
                        document.getElementById(`note${id}1`).innerHTML = "<span style='color: black;'>Hoạt động ổn định</span>";
                        document.getElementById(`note${id}2`).innerHTML = "<span style='color: black;'>Hoạt động ổn định</span>";
                    }
                    // 

                }
                document.getElementById(`temp${id}1`).innerHTML = `${device_data[2][endpoint]}°C`;
                document.getElementById(`temp${id}2`).innerHTML = `${device_data[3][endpoint]}°C`;
            }
        }
    });
}
function checkTimeSpace(tim1, tim2, ofset) {
    var timd1 = new Date(tim1);
    var timd2 = new Date(tim2);
    timd2.setMinutes(timd2.getMinutes() - ofset);

    if (timd1 > timd2) { return true; }
    else {
        return false;
    }
}
function convertLabel(time) {
    const sample_time = new Date(time);
    var min = sample_time.getMinutes();
    var hour = sample_time.getHours();
    var time = hour + ':' + min;
    return time;
}
function convertLabels(timestamps) {
    var labels = [];
    timestamps.forEach(time => {
        const sample_time = new Date(time);
        var min = sample_time.getMinutes();
        var hour = sample_time.getHours();
        var time = hour + ':' + min;
        labels.push(time);
    });
    return labels;
}
function timeCompare(t1, t2) {
    var arr1 = t1.split(':');
    var arr2 = t2.split(':');
    var n1 = parseInt(arr1[0]) * 100 + parseInt(arr1[1]);
    var n2 = parseInt(arr2[0]) * 100 + parseInt(arr2[1]);
    return (n1 > n2) ? true : false;
}
function dataParse(data) {
    var sample_time = [];
    var timestamp = [];
    var temperature1 = [];
    var temperature2 = [];
    for (let i = 0; i < data.Items.length; i++) {
        var timestp = JSON.parse(data.Items[i].sample_time);
        //get sample_time
        const time = new Date(timestp);
        sample_time.push(time);
        timestamp.push(timestp);
        temperature1.push(data.Items[i].device_data.temperature1);
        temperature2.push(data.Items[i].device_data.temperature2);
    }
    return [sample_time, timestamp, temperature1, temperature2];
}

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