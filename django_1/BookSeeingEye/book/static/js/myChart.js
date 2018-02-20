/* 
	dataTable Rendering
*/

$(document).ready(function () {
	var table = $('#data_table').DataTable({});
	$('#data_table tbody').on('click', 'tr', function () {
		$(this).toggleClass('selected');
	});
});

/* 
	chart.js Rendering

	item[0].cells[0] == <th scope="row" class="sorting_1">1</th>
	item[0].cells[1] == <td>직장인을 위한 실무 엑셀</td>
	item[0].cells[2] == <td>9791160500790</td>
	and so on...
*/
var prog_val = 0;
var item = $('#data_table > tbody > tr');
var strRank = [];
var strSellingPoint = [];
var strTitle = [];
var strBgColor = [];

for (var i = 0; i < item.length; i++) {
	strRank.push(item[i].cells[0].innerText);
	strTitle.push(item[i].cells[1].innerText);
	strSellingPoint.push(item[i].cells[7].innerText);

	strR = Math.floor(Math.random() * 255) + 1;
	strG = Math.floor(Math.random() * 255) + 1;
	strB = Math.floor(Math.random() * 255) + 1;
	strP = '0.5';
	strBgColor.push('rgba(' + strR + ',' + strG + ',' + strB + ',' + strP + ')');
}

ctx = document.getElementById("week_booklist_chart");
var myChart = new Chart(ctx, {
	//차트 타입
	type: 'bar',
	//차트 데이터
	data: {
		//차트 라벨
		labels: strTitle,
		//차트의 데이터 셋
		datasets: [{
			//차트 라벨과 함께 보여질 라벨 '#'에 labels가 하나씩 들어감
			label: '판매지수',
			//각 값은 labels에 대입된다.
			data: strSellingPoint,
			backgroundColor: strBgColor,
			borderColor: strBgColor,
			borderWidth: 1,
		}]
	},
	options: {
		scales: {
			xAxes: [{
				ticks: {
					autoSkip: false,
					maxRotation: 90,
					minRotation: 90
				}
			}]
		}
	},
});

$('#data_table_paginate > ul > li.paginate_button').click(function(){
	console.log('쿨릭')
	label_len = myChart.data.labels.length;
	data_len = myChart.data.datasets[0].data.length;

	for (var i = 0; i < label_len; i++) {
		myChart.data.labels.pop();
		myChart.data.datasets[0].data.pop();
	}

	item = $('#data_table > tbody > tr');
	for (var i = 0; i < item.length; i++) {
		strRank.push(item[i].cells[0].innerText);
		strTitle.push(item[i].cells[1].innerText);
		strSellingPoint.push(item[i].cells[7].innerText);
	}

	myChart.data.labels = strTitle;
	myChart.data.datasets.data = strSellingPoint;

	myChart.update();
});

$('#data_table_length > label > select').change(function(){
	console.log('쿨릭')
	label_len = myChart.data.labels.length;
	data_len = myChart.data.datasets[0].data.length;

	for (var i = 0; i < label_len; i++) {
		myChart.data.labels.pop();
		myChart.data.datasets[0].data.pop();
	}

	item = $('#data_table > tbody > tr');
	for (var i = 0; i < item.length; i++) {
		strRank.push(item[i].cells[0].innerText);
		strTitle.push(item[i].cells[1].innerText);
		strSellingPoint.push(item[i].cells[7].innerText);
	}

	myChart.data.labels = strTitle;
	myChart.data.datasets.data = strSellingPoint;

	myChart.update();
});

