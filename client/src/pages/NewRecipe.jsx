import React, { useState } from "react";
import Header from "../components/Header";
import Ingredients from "../components/Ingredients";
import RecipeInfo from "../components/RecipeInfo";
import "./NewRecipe.css";
import { UserAuth } from "../components/context/AuthContext";
import axios from "axios";
import Footer from "../components/Footer"

const NewRecipe = () => {
  const [ingredientsArr, setIngredientsArr] = useState([
    { name: "", quantity: "", unit: "" },
  ]);
  const [recipeInfo, setRecipeInfo] = useState({
    title: "",
    servings: "",
    hours: "",
    minutes: "",
    description: "",
    instructions: "",
    is_public: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ingredientsArr2 = ingredientsArr.map((ingredient) => {
        let string = `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`;
        return string;
      });
      const ingredientsStr = ingredientsArr2.join(", ");
      
      const recipePayload = {
        title: recipeInfo.title,
        servings: recipeInfo.servings || 1,
        hours: recipeInfo.hours || 0,
        minutes: recipeInfo.minutes || 0,
        description: recipeInfo.description,
        instructions: recipeInfo.instructions,
        is_public: recipeInfo.is_public
      };
      
      setRecipeInfo(recipePayload);

      const queryBody = {
        query: ingredientsStr,
        uid: user.uid,
        recipeInfo: recipePayload 
      };

      console.log(queryBody)
  
      await axios.post('/api/new-recipe/', queryBody);
      
      setIsSubmitted(true);
    } catch (error) {
      alert('Your recipe could not be saved, please check that you are signed in and filled in the recipe correctly and try again.');
    }

  };

  return (
    <div>
      <Header />
      {isSubmitted ?
        (<h2>Thank you for submitting a recipe, checkout "My Recipes" to see it.</h2>) :
      ( <div>
      <h1>New Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <Ingredients
            ingredientsArr={ingredientsArr}
            setIngredientsArr={setIngredientsArr}
          ></Ingredients>
          <RecipeInfo
            recipeInfo={recipeInfo}
            setRecipeInfo={setRecipeInfo}
          ></RecipeInfo>
        </div>
        <button className="btn right" type="submit">Submit new recipe</button>
      </form>
      </div>)

    }
    <Footer></Footer>
    </div>
  );
};

export default NewRecipe;
