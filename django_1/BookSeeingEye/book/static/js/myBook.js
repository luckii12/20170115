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

$('#data_table > tbody > tr').click(function(){
    $.ajax({
        url:'/getBook/',
        type:'post',
        data:{'isbn': $(this).find('td')[2].innerHTML},
        success:function(data){
            $('body > div > div > div.right_col > div:nth-child(4) > div:nth-child(2) > div > div.x_content > table > tbody > tr:nth-child(2) > td').text('');
            console.log(data['metadata'].length);
            for(var i = 0; i < data['metadata'].length; i++){
                console.log(data['metadata'][i]);
                var appendData = '<li>' + data['metadata'][i]['date'] + ' - ' + data['metadata'][i]['rank'] + '</li>';
                $('body > div > div > div.right_col > div:nth-child(4) > div:nth-child(2) > div > div.x_content > table > tbody > tr:nth-child(2) > td').append(appendData);
            }
        }
    });

    // 책 제목 여기에서 찍어주기
    $('body > div > div > div.right_col > div:nth-child(4) > div:nth-child(2) > div > div.x_content > table > tbody > tr:nth-child(1) > th > p').text($(this).find('td')[1].innerHTML);
});
