import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import SingleRecipe from "../components/SingleRecipe";
import './PublicRecipes.css';

function PublicRecipes() {
  const [publicRecipes, setPublicRecipes] = useState([]);
  const [isDefaultView, setIsDefaultView] = useState(true);
  const [singleRecipe, setSingleRecipe] = useState({});

  useEffect(() => {
    (async function () {
      const userRecipes = await axios
        .get(`/api/public-recipes/`)
        .then((results) => results.data)
        .catch((err) => false);
      
      for (let element of userRecipes) {
        console.log(element)
        element.ingredients = JSON.parse(element.ingredients)
      }
      if (typeof userRecipes === "object") {
        setPublicRecipes(userRecipes);
      }
    })();
  }, []);

  return (
    <div>
      <Header />
      <div className="contents">
        <h1>Public Recipes</h1>
        <div className="recipe-contents-div">
          {isDefaultView ? (
            publicRecipes.map((recipe, index) => {
              return (
                <RecipeCard
                  recipeInfo={recipe}
                  key={index}
                  index={index}
                  setSingleRecipe={setSingleRecipe}
                  setIsDefaultView={setIsDefaultView}
                />
              );
            })
          ) : (
            <SingleRecipe
              setIsDefaultView={setIsDefaultView}
              singleRecipe={singleRecipe}
            ></SingleRecipe>
          )}
        </div>

      </div>
      <Footer></Footer>
    </div>
  );
}

export default PublicRecipes;
