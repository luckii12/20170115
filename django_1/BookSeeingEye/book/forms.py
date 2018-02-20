from django import forms
from .models import Book, MetaData

class WeekBookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ('title')