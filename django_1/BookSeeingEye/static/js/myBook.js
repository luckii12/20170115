$(document).ready(function (){
    var myBookInfoGraph, myBookSPGraph;
    var table = $('#data_table').DataTable();

    $.ajaxSetup({ 
        beforeSend: function(xhr, settings) {
            function getCookie(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        } 
    });

    $('#data_table tbody').on('click', 'tr', function(){
        var tableData = table.row(this).data();
        // alert('You clicked on ' + data[2] + '\'s row');
        $.ajax({
            url:'/getBook/',
            type:'post',
            // isbn으로 데이터 요청
            data:{'isbn': tableData[3]},
            // 받은 데이터는 여기에 붙입니다.
            success:function(data){
                $('body > div > div > div.right_col > div:nth-child(4) > div:nth-child(2) > div > div.x_content > table > tbody > tr:nth-child(2) > td').text('');
                // console.log(data['metadata'].length);
                var temp_bookRank = [];
                var temp_bookDate = [];
                var temp_bookSP = [];
                for(var i = 0; i < data['metadata'].length; i++){
                    // console.log(data['metadata'][i]);
                    var appendData = '<li>' + data['metadata'][i]['date'] + ' - ' + data['metadata'][i]['rank'] + '</li>';
                    $('#bookRankGraph').append(appendData);
                    temp_bookRank.push(data['metadata'][i]['rank']);
                    temp_bookDate.push(data['metadata'][i]['date']);
                    temp_bookSP.push(data['metadata'][i]['sp']);
                }
                
                var temp_bookInfo = [temp_bookRank, temp_bookDate, temp_bookSP];
                console.log(temp_bookInfo);
                
                if(myBookInfoGraph == undefined){
                    myBookInfoGraph = drawBookInfoGraph(temp_bookInfo, temp_bookRank);
                    myBookSPGraph = drawSPInfoGraph(temp_bookInfo, temp_bookSP);
                }else{
                    myBookInfoGraph.data.datasets[0].data = temp_bookRank;
                    myBookInfoGraph.data.labels = temp_bookDate;

                    myBookSPGraph.data.datasets[0].data = temp_bookSP;
                    myBookInfoGraph.data.labels = temp_bookDate;

                    myBookInfoGraph.update();
                    myBookSPGraph.update();
                }
            }
        });
    
        // 책 제목 여기에서 찍어주기
        $('#bookName').text(tableData[2].replace('amp;', ''));    
        $('#bookName2').text(tableData[2].replace('amp;', ''));    
    });
});

function drawSPInfoGraph(resultGraphDatas, resultGraphColors){
    var ctx = $("#week_bookinfo_graph2");
	var myGraph = new Chart(ctx, {
		//차트 타입
		type: 'line',
		//차트 데이터
		data: {
			//차트 라벨
			labels: resultGraphDatas[1],
			//차트의 데이터 셋
			datasets: [{
				// 차트 라벨과 함께 보여질 라벨 '#'에 labels가 하나씩 들어감
				label: '판매지수',
				//각 값은 labels에 대입된다.
				data: resultGraphDatas[2],
				borderColor: "#3cbaff",
				fill: false
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
                }],
                yAxes: [{
                    ticks: {
                        reverse: false,
                    }
                }]
            },
		},
	});

	return myGraph;
}

function drawBookInfoGraph(resultGraphDatas, resultGraphColors){
    var ctx = $("#week_bookinfo_graph");
	var myGraph = new Chart(ctx, {
		//차트 타입
		type: 'line',
		//차트 데이터
		data: {
			//차트 라벨
			labels: resultGraphDatas[1],
			//차트의 데이터 셋
			datasets: [{
				// 차트 라벨과 함께 보여질 라벨 '#'에 labels가 하나씩 들어감
				label: '순위',
				//각 값은 labels에 대입된다.
				data: resultGraphDatas[0].reverse(),
				borderColor: "#3cba9f",
				fill: false
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
                }],
                yAxes: [{
                    ticks: {
                        reverse: true,
                    }
                }]
            },
		},
	});

	return myGraph;
}

function setGraphColors(item){
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

function setGraphDatas(item){
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