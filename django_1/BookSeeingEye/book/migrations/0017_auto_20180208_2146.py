# Generated by Django 2.0.1 on 2018-02-08 12:46

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0016_auto_20180208_2128'),
    ]

    operations = [
        migrations.AlterField(
            model_name='metadata',
            name='book',
            field=models.ForeignKey(on_delete=True, to='book.Book'),
        ),
        migrations.AlterField(
            model_name='metadata',
            name='crawl_date',
            field=models.DateTimeField(default=datetime.datetime(2018, 2, 8, 12, 46, 41, 325403, tzinfo=utc)),
        ),
    ]
