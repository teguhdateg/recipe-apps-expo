import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { favoritesStyles } from "../../assets/styles/favorites.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import NoFavoritesFound from "../../components/NoFavoriteFound";
import LoadingSpinner from "../../components/LoadingSpinner";
import RecipeCard from "../../components/RecipeCard";

const favoritesScreen = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [favoritesRecipes, setFavoritesRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/favorites/${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }
        const favorites = await response.json();
        setFavoritesRecipes(favorites);

        const transformedFavorites = favorites.map((favorite) => ({
          ...favorite,
          id: favorite.recipeId,
        }));
        setFavoritesRecipes(transformedFavorites);
      } catch (error) {
        console.error("Error loading favorites:", error);
        Alert.alert("Error", "Failed to load favorites. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, [user.id]);

  const handleSignOut = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: signOut,
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) return <LoadingSpinner message="Loading your favorites ..." />;

  return (
    <View style={favoritesStyles.container}>
      <ScrollView
        style={favoritesStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity
            style={favoritesStyles.logoutButton}
            onPress={() => handleSignOut()}
          >
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={favoritesRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            contentContainerStyle={favoritesStyles.recipesGrid}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NoFavoritesFound />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default favoritesScreen;
