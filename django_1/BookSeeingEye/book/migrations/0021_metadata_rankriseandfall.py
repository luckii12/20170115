# Generated by Django 2.0.2 on 2018-03-05 12:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0020_auto_20180228_1817'),
    ]

    operations = [
        migrations.AddField(
            model_name='metadata',
            name='rankRiseAndFall',
            field=models.IntegerField(default=9999),
        ),
    ]
