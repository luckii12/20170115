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

from django.shortcuts import render, redirect
from .models import Book, MetaData
from .forms import UserForm, LoginForm
from django.http import HttpResponse
from .mycore.week.weekBestCrawler import WeekCrawler
from django.utils import timezone
from django.contrib.auth.models import User             #장고 User 모델을 사용하는 듯
from django.contrib.auth import login, authenticate     #장고 로그인

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

def index(request):
    start_date = timezone.localtime().date()
    end_date = timezone.localtime().date() + timezone.timedelta(days=1) - timezone.timedelta(seconds=1)
    books = MetaData.objects.filter(crawl_date__range=(start_date, end_date))

    # print(request.POST['apple1'])

    if (books is not None):
        return render(request, 'book/index.html', {'books': books})
    else:
        return render(request, 'book/error_no_page.html')

# def login(request):
#     return render(request, 'book/login.html')

def signin(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username = username, password = password)
        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            return HttpResponse('로그인 실패. 다시 시도 해보세요.')
    else:
        form = LoginForm()
        return render(request, 'book/login.html', {'form': form})
    
#회원 가입 처리가 오면 여기에서 처리합니다.
def signup(request):
    if request.method == "POST":
        form = UserForm(request.POST)
        print('#TEST1#: ' + str(form))
        if form.is_valid():
            new_user = User.objects.create_user(**form.cleaned_data)
            login(request, new_user)
            #회원 가입 처리가 정상적으로 되면 login으로 처리합니다.
            return redirect('index')

    else:
        form = UserForm()
        return render(request, 'book/signup.html', {'form': form})