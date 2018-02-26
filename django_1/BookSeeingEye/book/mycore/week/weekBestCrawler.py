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

class WeekCrawler():
    '''
        1. 주간 베스트 글을 수집하여 Django ORM으로 DB에 저장.
        2. PageNumber에 1, 2, 3...
    '''
    urlBase = 'http://www.yes24.com/24/category/bestseller?CategoryNumber=001001003&sumgb=06&PageNumber='
    bookInfo = ['Year', 'Month', 'Day', 'Rank', 'Title',
                'ISBN', 'Writer', 'Publisher', 'Cate_A', 'Cate_B',
                'Cate_C', 'Cate_D', 'Price', 'Review', 'SellingPoint']
    
    start_date = timezone.localtime().date()
    end_date = timezone.localtime().date() + timezone.timedelta(days=1) - timezone.timedelta(seconds=1)

    def getDriver(self):
        try:
            driver = webdriver.Chrome('/Users/canine/Desktop/DEV/20170114/django_1/BookSeeingEye/book/driver/chromedriver.exe')
        except:
            driver = webdriver.Chrome('/Users/canine/Desktop/DEV/20170114/django_1/BookSeeingEye/book/driver/chromedriver')
        return driver

    def startCrawl(self, page, driver):
        if driver == None:
            print('driver is not found')
            return -1
        elif MetaData.objects.filter(crawl_date__range=(self.start_date, self.end_date)).count() >= 1:
            print('today crawl is done')
            return -2
        else:
            userPageInput = page
            for pageCount in range(1, page + 1):
                self.pageCrawl(pageCount, driver)

    def endCrawl(self, driver):
        if driver == None:
            print('driver is not found')
            return -1
        else:
            print('크롤러를 종료합니다.')
            driver.close()
            return 0

    def ORM_saveBook(self, book):
        if book is not None:
            # 이미 등록된 책이 있는 경우
            try:
                # ISBN으로 검사하면 된다.
                temp = Book.objects.get(isbn=int(book['ISBN']))
                MetaData.objects.create(
                    rank=book['Rank'],
                    reviewCount=book['Review'],
                    sellingPoint=book['SellingPoint'],
                    crawl_date=timezone.localtime().date(),
                    book=temp
                )
            # 등록된 책이 없는 경우
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
                        pubDate=book['Year'] + '-' + book['Month'] + '-' + book['Day']
                    )
                )

    def pageCrawl(self, page, driver):
        if(driver == None):
            print('driver is not found')
            return -1
        else:
            driver.get(self.urlBase + str(page))

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

                print(temp)
                self.ORM_saveBook(temp)
                driver.back()