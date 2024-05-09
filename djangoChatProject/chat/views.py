from django.shortcuts import render

# Create your views here.

def showMessagesPage(request):
    return render(request, 'messages.html')

