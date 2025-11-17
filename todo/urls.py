from django.urls import include, path
from . import views

urlpatterns = [
    path('addTask/', views.addTask, name='addTask'),
]