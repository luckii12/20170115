/*
	dataTable Rendering
*/

$(document).ready(function () {
	var table = $('#data_table').DataTable({
		dom: 'Blfrtip',
        buttons: [
        	'copy', 'csv', 'print'
        ]
	});
	var item = $('#data_table > tbody > tr');

	var resultBarDatas = setBarDatas(item);
	var resultBarColors = setBarColors(item);
	var myChart = drawBarChart(resultBarDatas, resultBarColors);

	var resultDonutDatas = setDonutDatas(item);
	var strPublisherName = [];
	var valPublisherName = [];
	for (var i = 0; i < 5; i++){
		strPublisherName.push(Object.keys(resultDonutDatas)[i]);
		valPublisherName.push(Object.values(resultDonutDatas)[i]);
	}
	var myDonut = drawDonutChart(strPublisherName, valPublisherName, resultBarColors);

	//단순히 Table이 다시 render가 되면 여기도 동작합니다.
	table.on('draw', function(){
		item = $('#data_table > tbody > tr');
		resultBarDatas = setBarDatas(item);
		resultBarColors = setBarColors(item);
		resultDonutDatas = setDonutDatas(item);
		
		myChart.data.datasets[0].data = resultBarDatas[0];
		myChart.data.labels = resultBarDatas[1];
		myChart.data.datasets[0].backgroundColor = resultBarColors;
		myChart.data.datasets[0].borderColor = resultBarColors;

		strPublisherName = [];
		valPublisherName = [];
		for (var i = 0; i < 5; i++){
			strPublisherName.push(Object.keys(resultDonutDatas)[i]);
			valPublisherName.push(Object.values(resultDonutDatas)[i]);
		}

		myDonut.data.datasets[0].data = valPublisherName;
		myDonut.data.labels = strPublisherName;
		myDonut.data.datasets[0].backgroundColor = resultBarColors;
		myDonut.data.datasets[0].borderColor = resultBarColors;
		myChart.update();
		myDonut.update();

		// 새 책 하이라이트
		checkNewBook(item);
	});
});

function checkNewBook(item){
	for (var i = 0; i < item.length; i++) {
		if(item[i].cells[1].innerText.match('new!')){
			// item[i].style.backgroundColor = '#FA5882';
			// item[i].style.opacity = '0.9';
			item[i].style.color = '#FA5882';
			item[i].style.fontWeight = '500';
		}
	}
}

function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>Full name:</td>'+
            '<td>'+d.name+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Extension number:</td>'+
            '<td>'+d.extn+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Extra info:</td>'+
            '<td>And any further details here (images etc)...</td>'+
        '</tr>'+
    '</table>';
}

/*
	chart.js Rendering
	item[0].cells[0] == <th scope="row" class="sorting_1">1</th>
	item[0].cells[1] == <td>직장인을 위한 실무 엑셀</td>
	item[0].cells[2] == <td>9791160500790</td>
	and so on...
*/

function setBarColors(item){
	var strBgColor = [];
	for (var i = 0; i < item.length; i++) {
		strR = Math.floor(Math.random() * 255) + 1;
		strG = Math.floor(Math.random() * 255) + 1;
		strB = Math.floor(Math.random() * 255) + 1;
		strP = '0.5';
		strBgColor.push('rgba(' + strR + ',' + strG + ',' + strB + ',' + strP + ')');
	}

	return strBgColor;
}

function setBarDatas(item){
	//var strRank = [];
	var strSellingPoint = [];
	var strTitle = [];

	for (var i = 0; i < item.length; i++) {
		//strRank.push(item[i].cells[0].innerText);
		strTitle.push(item[i].cells[2].innerText);
		strSellingPoint.push(item[i].cells[8].innerText);
	}

	var result = [strSellingPoint, strTitle];
	return result;
}

function setDonutDatas(item){
	pubValues = {};
	for (var i = 0; i < item.length; i++) {
		nowPubName = item[i].cells[5].innerText;
		if(pubValues[nowPubName] == undefined){
			pubValues[nowPubName] = 1;
		}else{
			pubValues[nowPubName] += 1;
		}
	}

	var result = pubValues;
	return result;
}

function drawBarChart(resultBarDatas, resultBarColors) {
	var ctx = document.getElementById("week_booklist_chart");
	var myChart = new Chart(ctx, {
		//차트 타입
		type: 'bar',
		//차트 데이터
		data: {
			//차트 라벨
			labels: resultBarDatas[1],
			//차트의 데이터 셋
			datasets: [{
				//차트 라벨과 함께 보여질 라벨 '#'에 labels가 하나씩 들어감
				label: '판매지수',
				//각 값은 labels에 대입된다.
				data: resultBarDatas[0],
				backgroundColor: resultBarColors,
				borderColor: resultBarColors,
				borderWidth: 1,
			}]
		},
		options: {
			scales: {
				xAxes: [{
					ticks: {
						autoSkip: false,
						maxRotation: 90,
						minRotation: 90,
						fontSize: 14,
					}
				}]
			}
		},
	});

	return myChart;
}

function drawDonutChart(strPublisherName, resultDonutDatas, resultDonutColors) {
	var ctx_donut = document.getElementById('week_booklist_donut');
	var myDonut = new Chart(ctx_donut, {
		//차트 타입
		type: 'doughnut',
		//차트 데이터
		data: {
			//차트 라벨
			labels: strPublisherName,
			//차트의 데이터 셋
			datasets: [{
				//차트 라벨과 함께 보여질 라벨 '#'에 labels가 하나씩 들어감
				label: '%',
				//각 값은 labels에 대입된다.
				data: resultDonutDatas,
				backgroundColor: resultDonutColors,
				borderColor: resultDonutColors,
				borderWidth: 1,
			}],
		},
		options: {
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						var allData = data.datasets[tooltipItem.datasetIndex].data;
						var tooltipLabel = data.labels[tooltipItem.index];
						var tooltipData = allData[tooltipItem.index];
						var total = 0;
						for (var i in allData) {
							total += allData[i];
						}
						var tooltipPercentage = Math.round((tooltipData / total) * 100);
						return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
					}
				}
			},
			responsive: true,
			maintainAspectRatio: false,
		},
	});

	return myDonut;
}