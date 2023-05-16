from django.db import models

# Create your models here.

class Item(models.Model):
    name = models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True)

class Recipes(models.Model):
    user_uid = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    servings = models.IntegerField()
    hours = models.IntegerField()
    minutes = models.IntegerField()
    description = models.TextField()
    instructions = models.TextField()
    ingredients = models.JSONField()
    total_calories = models.FloatField()
    total_protein = models.FloatField()
    total_carbohydrates = models.FloatField()
    calories_per_serving = models.FloatField()
    is_public = models.BooleanField()

    