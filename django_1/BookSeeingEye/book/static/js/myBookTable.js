$(document).ready();

function tableInitialize(){
    ajaxInit();


}

function callWholeTableInfo(){
    $.ajax({
        // 새로운 url 요청을 처리해야겠다.
        // 요청 방식은 익숙한 POST로 하자.
        url:'/getTableInfo/',
        type:'post',
        data:{},
        success:function(data){
            // 그릴 부분을 여기에서 얻어내고,
            // 그런 다음에 여기에서 테이블을 그려내면 되겠네.
        }
    })
}

function ajaxInit(){
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
}