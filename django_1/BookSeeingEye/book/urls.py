from django.conf.urls import url, include
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    # url(r'^weekBest/$', views.book_list, name='book_list'),
    url(r'^getBooks/$', views.get_books, name='get_books'),
    url(r'^getBook/$', views.get_book, name='get_book'),
    url(r'^getTodayBooks/$', views.get_today_books, name='get_today_books'),
    # url(r'^weekBest/chart/$', views.week_chart, name='week_chart'),
    url(r'^$', views.index, name='index'),
    url(r'^login/$', views.signin, name='login'),
    url(r'^logout/$', auth_views.logout, {'next_page' : '/login/'}),
    # url(r'^accounts/profile/$', views.signin, name='authlogin'),
    # url(r'^signup/$', views.signup, name='signup'),
    url(r'^join/$', views.signup, name='join'),
]