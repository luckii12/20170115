# Generated by Django 2.0.2 on 2018-03-06 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0022_auto_20180306_2117'),
    ]

    operations = [
        migrations.AlterField(
            model_name='metadata',
            name='rankRiseAndFall',
            field=models.CharField(default='?', max_length=128),
        ),
        migrations.AlterField(
            model_name='metadata',
            name='reviewCount',
            field=models.IntegerField(default=-1),
        ),
    ]
