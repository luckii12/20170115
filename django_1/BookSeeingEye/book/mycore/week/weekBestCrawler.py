# -*- coding: utf-8 -*-
from selenium import webdriver
import re
import os
# Python이 실행될 때 DJANGO_SETTINGS_MODULE이라는 환경 변수에 현재 프로젝트의 settings.py파일 경로를 등록합니다.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "book.settings")
# 이제 장고를 가져와 장고 프로젝트를 사용할 수 있도록 환경을 만듭니다.
import django
django.setup()
from book.models import Book, MetaData
from django.utils import timezone

'''
    크롬 헤들리스 버전으로 사용할 수 있다고 하는데?
'''
options = webdriver.ChromeOptions()
options.add_argument('headless')
options.add_argument('window-size=1920x1080')
options.add_argument("disable-gpu")
options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36")

'''
    1. 주간 베스트 글을 수집하여 Django ORM으로 DB에 저장.
    2. PageNumber에 1, 2, 3...
'''
max_crawl = 1
urlBase = 'http://www.yes24.com/24/category/bestseller?CategoryNumber=001001003&sumgb=06&PageNumber='
bookInfo = ['Year', 'Month', 'Day', 'Rank', 'Title',
    'ISBN', 'Writer', 'Publisher', 'Cate_A', 'Cate_B',
    'Cate_C', 'Cate_D', 'Price', 'Review', 'SellingPoint']

def getDriver():
    try:
        driver = webdriver.Chrome('/Users/canine/DEV/20170114/django_1/BookSeeingEye/book/driver/chromedriver', chrome_options=options)
    except:
        driver = webdriver.Chrome('/Users/canine/DEV/20170114/django_1/BookSeeingEye/book/driver/chromedriver.exe', chrome_options=options)
    return driver

def startCrawl(page, driver):
    if driver == None:
        print('driver is not found')
        return -1
    elif MetaData.objects.filter(crawl_date__range=(start_date, end_date)).count() >= max_crawl:
        print('today crawl is done')
        return -2
    else:
        for pageCount in range(1, page + 1):
            pageCrawl(pageCount, driver)

def endCrawl(driver):
    if driver == None:
        print('driver is not found')
        return -1
    else:
        print('크롤러를 종료합니다.')
        driver.close()
        return 0

def ORM_saveBook(book):
    '''
        book 인스턴스를 받아서 책을 데이터 베이스에 저장함
            - ISBN이 있는 책인 경우에는 MetaData만 저장함
            - ISBN이 없는 책은 책도 새로 등록함
    '''
    if book is not None:
        try:
            temp = Book.objects.get(isbn=int(book['ISBN']))
            MetaData.objects.create(
                rank=book['Rank'],
                reviewCount=book['Review'],
                sellingPoint=book['SellingPoint'],
                crawl_date=timezone.localtime(),
                book=temp
            )
        except:
            MetaData.objects.create(
                rank=book['Rank'],
                reviewCount=book['Review'],
                sellingPoint=book['SellingPoint'],
                crawl_date=timezone.localtime(),
                book=Book.objects.create(
                    title=book['Title'],
                    isbn=int(book['ISBN']),
                    author=book['Writer'],
                    publisher=book['Publisher'],
                    price=book['Price'],
                    pubDate=book['Year'] + '-' + book['Month'] + '-' + book['Day'],
                    category=book['Category'],
                )
            )

def pageCrawl(page, driver):
    if(driver == None):
        print('driver is not found')
        return -1
    else:
        driver.get(urlBase + str(page))

        for i in range(1, 21):
            temp = {}

            pos = str(1 + (i - 1) * 2)
            temp['Rank'] = i + (page - 1) * 20
            item = driver.find_element_by_xpath('//*[@id="category_layout"]/tbody/tr[' + pos + ']/td[3]/p[1]/a[1]')
            temp['Title'] = item.text
            temp['Writer'] = driver.find_element_by_xpath('//*[@id="category_layout"]/tbody/tr[' + pos + ']/td[3]/div/a[1]').text

            driver.execute_script("arguments[0].click();", item)

            try:
                temp['ISBN'] = driver.find_element_by_css_selector('#tblGoodsFairTraderNoti tbody tr:nth-child(3) td').text
            except:
                temp['ISBN'] = 0

            temp['Publisher'] = driver.find_element_by_css_selector('span.gd_pub a').text
            temp['Price'] = int(re.sub('[^0-9]', '', driver.find_element_by_xpath('//*[@id="yDetailTopWrap"]/div[2]/div[2]/div[1]/div[1]/table/tbody/tr[1]/td/span/em').text))

            try:
                temp['Review'] = int(
                    driver.find_element_by_css_selector('span.gd_reviewCount em').text)
            except:
                temp['Review'] = 0

            raw_date = driver.find_element_by_css_selector('span.gd_date').text
            temp['Year'] = raw_date[0:4]
            temp['Month'] = raw_date[6:8]
            temp['Day'] = raw_date[10:12]

            try:
                temp['SellingPoint'] = int(re.sub('[^0-9]', '', driver.find_element_by_css_selector('span.gd_sellNum').text))
            except:
                temp['SellingPoint'] = 'SP_IS_NONE'

            try:       
                temp['Category'] = driver.find_element_by_css_selector('.basicListType ul').text.replace("\n","<br/>")
                print(temp['Category'])
                    
            except:
                temp['Category'] = 'None'

            print(temp)
            ORM_saveBook(temp)
            driver.back()

'''
    날짜 구하기 전용 함수를 모아놓은 곳
        - getTodayEdge: 정확하게 오늘의 끝 시간을 계산
        - getTodayStart: 오늘의 시작 시간을 계산
        ...
'''
def getTodayEdge():
    return getTodayStart() + timezone.timedelta(hours=23, minutes=59, seconds=59)

def getTodayStart():
    return timezone.localtime() - timezone.timedelta(hours=timezone.localtime().hour, minutes=timezone.localtime().minute, seconds=timezone.localtime().second)

def getYesterdayEdge():
    return getTodayStart() - timezone.timedelta(seconds=1)

def getYesterdayStart():
    return getTodayStart() - timezone.timedelta(days=1)

def getBookList(start, end):
    return MetaData.objects.filter(crawl_date__range=(start, end))

def getBookMetaDataList(user_isbn):
    temp = []
    try:
        book = Book.objects.get(isbn = str(user_isbn))
        for item in MetaData.objects.filter(book = book):
            temp_dic = {}
            temp_dic['date'] = item.crawl_date.date()
            temp_dic['rank'] = item.rank
            temp_dic['sp'] = item.sellingPoint
            temp.append(temp_dic)
    except:
        # 누른 책이 없는 책일 수는 없기는 함
        pass
    
    return temp

'''
    어제 오늘의 rank를 비교하여 Model의 rankRiseAndFall 값에 저장한다.

    알고리즘?
        - 오늘 수집한 책 리스트를 가져온다
        - 어제 수집한 책 리스트를 가져온다
        - 오늘 수집한 책을 기준으로 1~N위까지...
            - isbn이 같으면 순위가 그대로 임
            - isbn이 다르면...
                - 새로운 책이거나
                - 순위가 바뀐 책임
'''
def setRankRiseAndFall(today_list, yesterday_list):
    for item in today_list:
        try:
            if(item.book.isbn == yesterday_list.get(book = item.book).book.isbn):
                if(item.rank == yesterday_list.get(book = item.book).rank):
                    item.rankRiseAndFall = 0
                else:
                    riseandfall = yesterday_list.get(book = item.book).rank - item.rank
                    item.rankRiseAndFall = str(riseandfall)
        except:   
            item.rankRiseAndFall = 'new!'
            # item.save()
        
        # Save today_list book as item
        item.save()

start_date = getTodayStart()
end_date = getTodayEdge()