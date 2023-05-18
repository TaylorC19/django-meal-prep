from rest_framework.response import Response
from rest_framework.decorators import api_view
from base.models import Item, Recipes
from .serializers import ItemSerializer, RecipesSerializer
import os
import dotenv
import requests
import json

dotenv.load_dotenv()

def nutrition(ingredients): 
    ingredients_arr = []
    nutrition_obj = { "totalCalories": 0, "totalProtein" : 0, "totalCarbohydrates": 0}
    nutrition_info = requests.post("https://trackapi.nutritionix.com/v2/natural/nutrients", json=ingredients, headers=apiHeader)
    # print('😪',json.loads(nutrition_info.text))
    ingredients_info = json.loads(nutrition_info.text)["foods"]
    
    for val in ingredients_info:
        ingredient_obj = {
        "name": val["food_name"],
        "quantity": val["serving_qty"],
        "unit": val["serving_unit"],
        "calories": val["nf_calories"],
        "protein": val["nf_protein"],
        "carbohydrates": val["nf_total_carbohydrate"]
        }
        ingredients_arr.append(ingredient_obj)
        nutrition_obj["totalCalories"] = nutrition_obj["totalCalories"] + val["nf_calories"]
        nutrition_obj["totalProtein"] = nutrition_obj["totalProtein"] + val["nf_protein"]
        nutrition_obj["totalCarbohydrates"] = nutrition_obj["totalCarbohydrates"] + val["nf_total_carbohydrate"]

    return { "ingredients_arr": ingredients_arr, "nutrition_obj": nutrition_obj }
    # return json.loads(nutrition_info.text)["foods"]


apiHeader = {
  "x-app-id": os.getenv('X_APP_ID'),
  "x-app-key": os.getenv('X_APP_KEY'),
  "x-remote-user-id": os.getenv('X_REMOTE_USER_ID'),
  "Content-Type": "application/json",
}

@api_view(['GET'])
def getData(request):
    items = Item.objects.all()
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def world(request):
    payload = nutrition(request.data)
    return Response(payload)

@api_view(['POST'])
def addItem(request):
    serializer = ItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)
@api_view(['POST'])
def addRecipe(request):
    uid = request.data['uid']
    requestQuery = {
        "query": request.data['query']
    }
    recipeInfo = request.data['recipeInfo']
    
    nutritionInfo = nutrition(requestQuery)

    newRecipe = {
        "user_uid": uid,
        "ingredients": json.dumps(nutritionInfo["ingredientsArr"]),
        "total_calories": nutritionInfo["nutritionObj"]["totalCalories"],
        "total_protein": nutritionInfo["nutritionObj"]["totalProtein"],
        "total_carbohydrates": nutritionInfo["nutritionObj"]["totalCarbohydrates"],
        "calories_per_serving":nutritionInfo["nutritionObj"]["totalCalories"] / recipeInfo["servings"],
    }
    newRecipe.update(recipeInfo)

    return Response(newRecipe)


# @api_view(['GET'])
# def public_recipes(request):
# 