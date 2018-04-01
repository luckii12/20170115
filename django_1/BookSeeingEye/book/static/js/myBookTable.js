$(document).ready();

function tableInitialize() {
	ajaxInit();
}

function callWholeTableInfo() {
	/*
	var data_table = $('#data_table_ajax').DataTable({
			// Ajax로 데이터를 보낸 것을 받음 처리하는 부분 
			// 각 Column에서 값이 없으면 -로 처리한다고 한다.
		  
			"columnDefs": [{
					"defaultContent": "-",
					"targets": "_all"
			}],
			pageLength: 10,                             // 기본 페이지 길이를 10으로 합니다.
			bPaginate: true,                            // 페이징 활성화 옵션
			responsive: true,                           // 반응형 활성화 옵션
			processing: true,                           // Ajax 통신 필수 옵션
			ordering: true,                             // 오더링 활성화 옵션
			bServerSide: true,                          // Ajax 통신 필수 옵션
			searching: false,                           // 검색 활성화 옵션
			"sAjaxSource": "/user/search_user?num=@",   // 서버 요청 URL, @을 해주면 처음 화면에서 데이터를 뿌려도 되지 않음
			columns: [                                  // TableHeader 정의
					{ data: 'num' },
					{ data: 'name' },
					{ data: 'age' },
					{ data: 'address' }
			]
	});
	*/

	$.ajax({
		url: '/getBook/',
		type: 'post',
		data: {},
		success: function (data) {

		}
	});
}

function ajaxInit() {
	$.ajaxSetup({
		beforeSend: function (xhr, settings) {
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
}