# Generated by Django 2.0.2 on 2018-04-03 13:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0024_auto_20180316_2123'),
    ]

    operations = [
        migrations.AddField(
            model_name='metadata',
            name='bookUrl',
            field=models.CharField(default='none', max_length=512),
        ),
    ]
