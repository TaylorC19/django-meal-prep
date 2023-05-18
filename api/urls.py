from django.urls import path
from . import views

urlpatterns = [
    path('', views.getData),
    path('add/', views.addItem),
    path('hello/', views.world),
    path('new-recipe/', views.addRecipe)
]