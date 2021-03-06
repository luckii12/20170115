# Generated by Django 2.0.1 on 2018-02-07 12:32

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0012_auto_20180207_1938'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='meta',
        ),
        migrations.AddField(
            model_name='metadata',
            name='book',
            field=models.ForeignKey(blank=True, null=True, on_delete=True, to='book.Book'),
        ),
        migrations.AlterField(
            model_name='book',
            name='title',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
        migrations.AlterField(
            model_name='metadata',
            name='crawl_date',
            field=models.DateTimeField(default=datetime.datetime(2018, 2, 7, 12, 32, 2, 301585, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='metadata',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='metadata',
            name='rank',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
