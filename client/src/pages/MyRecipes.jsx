import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { UserAuth } from "../components/context/AuthContext";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import SingleRecipe from "../components/SingleRecipe";

const MyRecipes = () => {
  const [myRecipes, setMyRecipes] = useState([]);
  const [isDefaultView, setIsDefaultView] = useState(true);
  const [singleRecipe, setSingleRecipe] = useState({});

  const { user } = UserAuth();

  useEffect(() => {
    (async function () {
      const userRecipes = await axios
        .get(`/api/recipes/${user.uid}/`)
        .then((results) => results.data);
      for (let element of userRecipes) {
        console.log(element)
        element.ingredients = JSON.parse(element.ingredients)
      }
      setMyRecipes(userRecipes);
      return "allGood";
    })();
    // console.log('useEffect')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // getRecipes();
  }, [user.uid]);

  return (
    <div>
      <Header />
      <div className="contents">
        <h1>Your Recipes</h1>

        <div className="recipe-contents-div">
          {isDefaultView ? (
            myRecipes.map((recipe, index) => {
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
};

export default MyRecipes;
