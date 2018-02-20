# from django.views.generic import ListView, DetailView
# from .models import Book
#
# #--- listview
# """
#     1. 컨텍스트 변수로 object_list를 사용하면 된다고 한다(?).
#     2. 템플릿 파일을 모델명소문자_list.html라고 지으면 장고에서 알아서 지정해준다.
#         2-1. ListView를 상속받아서 _list라고 이름 짓기가 가능한 듯(추측)
#         2-2. 만약 DetailView를 상속받아서 사용하려면 _detail이라고 이름을 지어야 하는 듯(추측)
# """
# class BookLV(ListView):
#     model = Book
#
# class PublisherV():
#     pass

from django.shortcuts import render
from .models import Book, MetaData
from django.shortcuts import redirect
from .mycore.week.weekBestCrawler import WeekCrawler
from django.utils import timezone

def book_list(request):
    start_date = timezone.localtime().date() + timezone.timedelta(hours=3)
    end_date = timezone.localtime().date() + timezone.timedelta(days=1)
    books = MetaData.objects.filter(crawl_date__range=(start_date, end_date))

    #print(request.POST['apple1'])

    if(books is not None):
        return render(request, 'book/book_list.html', {'books': books})
    else:
        return render(request, 'book/error_no_page.html')

def get_book(request):
    bookQuantity = int(request.POST.get('bookQuantity'))
    print(bookQuantity)
    #
    if(bookQuantity > 0):
        #print('리퀘스트: ' + str(request.POST))
        #if(request.method == 'POST'):
        print('리퀘스트: ' + str(request.POST))
        #if(request.POST['bookQuantity'] > 0):
        startCrawler = WeekCrawler()
        driver = startCrawler.getDriver()
        startCrawler.startCrawl(bookQuantity, driver)
        startCrawler.endCrawl(driver)
        return redirect('index')

def week_chart(request):
    pass

def index(request):
    start_date = timezone.localtime().date() + timezone.timedelta(hours=3)
    end_date = timezone.localtime().date() + timezone.timedelta(days=1)
    books = MetaData.objects.filter(crawl_date__range=(start_date, end_date))

    # print(request.POST['apple1'])

    if (books is not None):
        return render(request, 'book/index.html', {'books': books})
    else:
        return render(request, 'book/error_no_page.html')