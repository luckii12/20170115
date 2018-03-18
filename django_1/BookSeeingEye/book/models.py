from django.db import models
from django.db.models import ForeignKey
# from django_mysql.models import ListCharField
from django.utils import timezone
from datetime import datetime

class Book(models.Model):
    # 기본 정보
    title = models.CharField(default='Title_None', max_length=256)
    isbn = models.IntegerField(primary_key=True)
    author = models.CharField(default='Author_None', max_length=256)
    translater = models.CharField(default='Translater_None', max_length=256)
    publisher = models.CharField(default='Publisher_None', max_length=256)
    price = models.IntegerField(default=0)
    pubDate = models.CharField(default="Pubdate_None", max_length=256)

    # 책 카테고리 분류
    category = models.CharField(default="None", max_length=1024)
    # category = models.ListCharField(
    #     base_field = CharField(max_length=128),
    #     size = 5,
    #     max_length = (5 * 128)
    # )

    def __str__(self):
        return self.title

class MetaData(models.Model):
    # 메타데이터 기본 정보
    rank = models.IntegerField(default=-1)
    rankRiseAndFall = models.CharField(default='?', max_length=128)
    reviewCount = models.IntegerField(default=-1)
    sellingPoint = models.IntegerField(default=-1)

    # 정보 수집 날짜 자동 입력
    crawl_date = models.DateTimeField()

    # 책
    book = models.ForeignKey('Book', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.book)