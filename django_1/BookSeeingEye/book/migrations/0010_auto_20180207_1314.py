# Generated by Django 2.0.1 on 2018-02-07 04:14

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0009_auto_20180204_1759'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='crawl_date',
            field=models.DateTimeField(default=datetime.date(2018, 2, 7)),
        ),
    ]
