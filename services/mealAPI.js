import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const BaseURL = "https://www.themealdb.com/api/json/v1/1";

export const MealAPI = {
  searchMealsByName: async (query) => {
    try {
      const response = await fetch(
        `${BaseURL}/search.php?s=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error searching meals by name:", error);
      return [];
    }
  },

  getMealById: async (id) => {
    try {
      const response = await fetch(`${BaseURL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error("Error getting meal by ID:", error);
      return null;
    }
  },

  getRandomMeal: async () => {
    try {
      const response = await fetch(`${BaseURL}/random.php`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error("Error getting random meal:", error);
      return null;
    }
  },

  getRandomMeals: async (count = 5) => {
    try {
      const promise = Array(count)
        .fill()
        .map(() => MealAPI.getRandomMeal());
      const meals = await Promise.all(promise);
      return meals.filter((meal) => meal !== null);
    } catch (error) {
      console.error("Error getting random meals:", error);
      return [];
    }
  },

  getCategories: async () => {
    try {
      const response = await fetch(`${BaseURL}/categories.php`);
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error("Error getting categories:", error);
      return [];
    }
  },

  filterByIngredient: async (ingredient) => {
    try {
      const response = await fetch(
        `${BaseURL}/filter.php?i=${encodeURIComponent(ingredient)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error filtering by ingredient:", error);
      return [];
    }
  },

  filterByCategory: async (category) => {
    try {
      const response = await fetch(
        `${BaseURL}/filter.php?c=${encodeURIComponent(category)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error filtering by category:", error);
      return [];
    }
  },

  transformMealData: (meal) => {
    if (!meal) return null;
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : "",
        });
      }
    }

    const instructions = meal.strInstructions
      ? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim())
      : [];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: meal.strInstructions
        ? meal.strInstructions.substring(0, 120) + "..."
        : "Delicious meal from the MealDB",
      image: meal.strMealThumb,
      cookTime: "30 minutes",
      servings: 4,
      category: meal.strCategory || "main course",
      area: meal.strArea,
      ingredients,
      instructions,
      originalData: meal,
    };
  },
};
