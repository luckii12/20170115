$(document).ready(function (){
    var myBookInfoGraph;
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
                var temp_bookInfo = [];
                var temp_bookRank = [];
                var temp_bookDate = [];
                for(var i = 0; i < data['metadata'].length; i++){
                    // console.log(data['metadata'][i]);
                    var appendData = '<li>' + data['metadata'][i]['date'] + ' - ' + data['metadata'][i]['rank'] + '</li>';
                    $('#bookRankGraph').append(appendData);
                    temp_bookRank.push(data['metadata'][i]['rank']);
                    temp_bookDate.push(data['metadata'][i]['date']);
                }

                temp_bookInfo.push(temp_bookRank);
                temp_bookInfo.push(temp_bookDate);
                
                if(myBookInfoGraph == undefined){
                    myBookInfoGraph = drawBookInfoGraph(temp_bookInfo, setGraphColors(data['metadata']));
                }else{
                    
                }
            }
        });
    
        // 책 제목 여기에서 찍어주기
        $('body > div > div > div.right_col > div:nth-child(4) > div:nth-child(2) > div > div.x_content > table > tbody > tr:nth-child(1) > th > p').text($(this).find('td')[1].innerHTML);
    
        // Book Info Chart 여기에서 그려주기
        /* 
            1. 처음에 아무 것도 그려져 있지 않다면 인스턴스를 만들어 그림
            2. 뭔가 그려져 있다면(인스턴스가 있다면) 리로드만 하면 된다.
        */
        
    });
});

function drawBookInfoGraph(resultGraphDatas, resultGraphColors){
	var ctx = document.getElementById("week_bookinfo_graph");
	var myGraph = new Chart(ctx, {
		//차트 타입
		type: 'bar',
		//차트 데이터
		data: {
			//차트 라벨
			labels: resultGraphDatas[1],
			//차트의 데이터 셋
			datasets: [{
				//차트 라벨과 함께 보여질 라벨 '#'에 labels가 하나씩 들어감
				label: '날짜',
				//각 값은 labels에 대입된다.
				data: resultGraphDatas[0],
				backgroundColor: resultGraphColors,
				borderColor: resultGraphColors,
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