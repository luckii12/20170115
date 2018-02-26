from django.db import models
from django.db.models import ForeignKey
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
    cate_A = models.CharField(null=True, blank=True, max_length=256)
    cate_B = models.CharField(null=True, blank=True, max_length=256)
    cate_C = models.CharField(null=True, blank=True, max_length=256)
    cate_D = models.CharField(null=True, blank=True, max_length=256)

    def __str__(self):
        return self.title

class MetaData(models.Model):
    # 메타데이터 기본 정보
    rank = models.IntegerField(default=-1)
    reviewCount = models.IntegerField(default=-1)
    sellingPoint = models.IntegerField(default=-1)

    # 정보 수집 날짜 자동 입력
    crawl_date = models.DateTimeField()

    # 책
    book = models.ForeignKey('Book', on_delete=True)

    def __str__(self):
        return str(self.book)