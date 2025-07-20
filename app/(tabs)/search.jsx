import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useEffect, useState } from "react";
import { MealAPI } from "../../services/mealAPI";
import useDebounce from "../../hooks/useDebounce";
import { searchStyles } from "../../assets/styles/search.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import RecipeCard from "../../components/RecipeCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const searchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const performSearch = async (query) => {
    if (!query.trim()) {
      const randomMeals = await MealAPI.getRandomMeals(12);
      return randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);
    }

    const nameResults = await MealAPI.searchMealsByName(query);
    let result = nameResults;

    if (result.length === 0) {
      const ingredientResults = await MealAPI.filterByIngredient(query);
      result = ingredientResults;
    }

    return result
      .slice(0, 12)
      .map((meal) => MealAPI.transformMealData(meal))
      .filter((meal) => meal !== null);
  };

  useEffect(() => {
    const loadingInitialData = async () => {
      try {
        const results = await performSearch("");
        setRecipes(results);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setInitialLoad(false);
      }
    };
    loadingInitialData;
  }, []);

  useEffect(() => {
    if (initialLoad) return;

    const handleSearch = async () => {
      setLoading(true);
      try {
        const results = await performSearch(debouncedSearchQuery);
        setRecipes(results);
      } catch (error) {
        console.error("Error performing search:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    handleSearch();
  }, [debouncedSearchQuery, initialLoad]);

  if (initialLoad) return <LoadingSpinner message="Loading recipes ..." />;

  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textLight}
            style={searchStyles.searchIcon}
          />
          <TextInput
            style={searchStyles.searchInput}
            placeholder="Search recipes, indredients..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery > 0 ? (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={searchStyles.clearButton}
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={searchStyles.resultsSection}>
        <View style={searchStyles.resultsHeader}>
          <Text style={searchStyles.resultsTitle}>
            {debouncedSearchQuery
              ? `Results for "${debouncedSearchQuery}"`
              : "Popular Recipes"}
          </Text>
          <Text style={searchStyles.resultsCount}>
            {recipes.length} {recipes.length === 1 ? "result" : "results"}
          </Text>
        </View>
        {loading ? (
          <View style={searchStyles.loadingContainer}>
            <LoadingSpinner message="Loading Search Results" />
          </View>
        ) : (
          <FlatList
            data={recipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={searchStyles.row}
            contentContainerStyle={searchStyles.recipesGrid}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NoResoultsFound />}
          />
        )}
      </View>
    </View>
  );
};

export default searchScreen;

function NoResoultsFound() {
  return (
    <View style={searchStyles.emptyState}>
      <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
      <Text style={searchStyles.emptyTitle}>No Results Found</Text>
      <Text style={searchStyles.emptyDescription}>
        Try searching for a different recipe or ingredient.
      </Text>
    </View>
  );
}
