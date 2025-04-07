import React, { useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  ScrollView,
  ImageBackground, 
  Dimensions 
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = 180;

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const { currentTheme, interpolatedColors } = useTheme();
  const scrollX = useRef(new Animated.Value(0)).current;

  const categories = [
    { id: 'singing', name: 'Singing', icon: '🎤', bgImage: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&h=600' },
    { id: 'instrument', name: 'Instrument Playing', icon: '🎸', bgImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&h=600' },
    { id: 'videography', name: 'Videography', icon: '📹', bgImage: 'https://images.unsplash.com/photo-1569420067112-355353e8f453?auto=format&fit=crop&w=800&h=600' },
    { id: 'writing', name: 'Short Stories', icon: '✍️', bgImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&h=600' },
  ];

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryPosts', { category });
  };

  const renderCategory = ({ item, index }) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => handleCategoryPress(item.id)}
      >
        <Animated.View 
          style={[
            styles.card,
            { transform: [{ scale }] }
          ]}
        >
          <ImageBackground
            source={{ uri: item.bgImage }}
            style={styles.cardBackground}
            imageStyle={styles.cardImage}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
              style={styles.cardGradient}
            >
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <Text style={styles.categoryName}>{item.name}</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolatedColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentTheme.text }]}>Explore Categories</Text>
        <Text style={[styles.subtitle, { color: currentTheme.textSecondary }]}>
          Discover talent across different categories
        </Text>
      </View>

      <Animated.FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={renderCategory}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
      />
      
      <View style={styles.trendingSection}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Trending Now</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={[styles.trendingCard, { backgroundColor: currentTheme.cardBackground }]} 
              onPress={() => handleCategoryPress(category.id)}
            >
              <Text style={styles.trendingIcon}>{category.icon}</Text>
              <Text style={[styles.trendingName, { color: currentTheme.text }]}>
                #{category.name.replace(' ', '')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
  },
  categoriesList: {
    paddingLeft: width * 0.1,
    paddingRight: width * 0.1,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 7,
  },
  cardBackground: {
    width: '100%',
    height: '100%',
  },
  cardImage: {
    borderRadius: 16,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  categoryInfo: {
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  trendingSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  trendingScroll: {
    paddingVertical: 8,
  },
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  trendingIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  trendingName: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CategoriesScreen;