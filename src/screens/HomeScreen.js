import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions, Animated, TextInput, StatusBar, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { usePosts } from "../context/PostContext";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from 'expo-linear-gradient';
import profileImage from "../assets/profile.jpg";

const { width } = Dimensions.get('window');

// Static data moved to their own constant section
const staticPosts = [
  {
    id: '1',
    user: 'Admin',
    username: '@admin',
    profilePic: require('../assets/profile.jpg'),
    image: require('../assets/post1.jpg'),
    likes: 0,
    caption: 'Exploring new horizons!',
    comments: 5,
    timePosted: '2h ago'
  },
  {
    id: '2',
    user: 'Admin',
    username: '@admin',
    profilePic: require('../assets/profile.jpg'),
    image: require('../assets/post2.jpg'),
    likes: 0,
    caption: 'Campus life at its best ✨',
    comments: 2,
    timePosted: '5h ago'
  },
];

const stories = [
  { id: '1', user: 'Dance', image: require('../assets/dance.png'), hasNewStory: true },
  { id: '2', user: 'Guitar', image: require('../assets/guitar.png'), hasNewStory: true },
  { id: '3', user: 'Art', image: require('../assets/profile.jpg'), hasNewStory: false },
  { id: '4', user: 'Gaming', image: require('../assets/profile.jpg'), hasNewStory: true },
  { id: '5', user: 'Sports', image: require('../assets/profile.jpg'), hasNewStory: false },
];

// Separate components for better organization
const StoryItem = React.memo(({ item, themeColors }) => (
  <TouchableOpacity style={styles.storyContainer}>
    <LinearGradient
      colors={item.hasNewStory ? ['#FF8500', '#FF2D55'] : ['transparent', 'transparent']}
      style={styles.storyGradient}
    >
      <View style={styles.storyImageContainer}>
        <Image source={item.image} style={styles.storyImage} />
      </View>
    </LinearGradient>
    <Text style={[styles.storyText, { color: themeColors.text }]} numberOfLines={1}>{item.user}</Text>
  </TouchableOpacity>
));

const PostItem = React.memo(({
  item,
  likedPosts,
  toggleLike,
  showCommentInput,
  handleCommentPress,
  commentText,
  setCommentText,
  handleSubmitComment,
  themeColors,
  navigationToComments
}) => (
  <View style={[styles.postContainer, { backgroundColor: themeColors.cardBackground }]}>
    <View style={styles.userInfo}>
      <Image
        source={item.profilePic || profileImage}
        style={styles.profilePic}
      />
      <View style={styles.userTextContainer}>
        <Text style={[styles.username, { color: themeColors.text }]}>
          {item.user || "User"}
        </Text>
        <Text style={[styles.userHandle, { color: themeColors.secondaryText }]}>
          {item.username || "@username"} • {item.timePosted || "Just now"}
        </Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Feather name="more-horizontal" size={20} color={themeColors.secondaryText} />
      </TouchableOpacity>
    </View>

    <TouchableOpacity activeOpacity={0.95} onPress={() => toggleLike(item.id)}>
      <Image
        source={item.file ? { uri: item.file } : item.image}
        style={styles.postImage}
      />
    </TouchableOpacity>

    {item.caption && (
      <Text style={[styles.caption, { color: themeColors.text }]}>
        <Text style={styles.captionUsername}>{item.user} </Text>
        {item.caption}
      </Text>
    )}

    <View style={styles.actions}>
      <View style={styles.leftActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
          <Ionicons
            name={likedPosts.has(item.id) ? 'heart' : 'heart-outline'}
            size={24}
            color={likedPosts.has(item.id) ? '#FF2D55' : themeColors.text}
          />
          {item.likes > 0 && (
            <Text style={[styles.actionText, { color: themeColors.secondaryText }]}>
              {item.likes}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleCommentPress(item.id)}>
          <Ionicons name="chatbubble-outline" size={22} color={themeColors.text} />
          {item.comments > 0 && (
            <Text style={[styles.actionText, { color: themeColors.secondaryText }]}>
              {item.comments}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Feather name="send" size={22} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Feather name="bookmark" size={22} color={themeColors.text} />
      </TouchableOpacity>
    </View>

    {item.comments > 0 && (
      <TouchableOpacity
        style={styles.viewAllCommentsButton}
        onPress={() => navigationToComments && navigationToComments(item.id)}
      >
        <Text style={[styles.viewAllCommentsText, { color: themeColors.secondaryText }]}>
          View all {item.comments} comments
        </Text>
      </TouchableOpacity>
    )}

    {showCommentInput === item.id && (
      <View style={[styles.commentInputContainer, { borderTopColor: themeColors.inputBackground }]}>
        <Image source={profileImage} style={styles.commentProfilePic} />
        <TextInput
          style={[styles.commentInput, {
            color: themeColors.text,
            backgroundColor: themeColors.inputBackground,
          }]}
          placeholder="Add a comment..."
          placeholderTextColor={themeColors.secondaryText}
          value={commentText}
          onChangeText={setCommentText}
          multiline
          returnKeyType="send"
          onSubmitEditing={() => handleSubmitComment(item.id)}
        />
        <TouchableOpacity
          style={[styles.sendButton, {
            backgroundColor: commentText.trim() ? themeColors.primary : themeColors.inputBackground
          }]}
          disabled={!commentText.trim()}
          onPress={() => handleSubmitComment(item.id)}
        >
          <Feather name="send" size={16} color={commentText.trim() ? "white" : themeColors.secondaryText} />
        </TouchableOpacity>
      </View>
    )}
  </View>
));

const HomeScreen = ({ navigation }) => {
  const { state } = usePosts();
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [postData, setPostData] = useState([]);
  const [showCommentInput, setShowCommentInput] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({}); // Added to store comments
  const { currentTheme } = useTheme();
  const flatListRef = useRef();

  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

  // Custom theme colors to replace purple
  const themeColors = useMemo(() => ({
    primary: '#1E88E5', // More professional blue instead of purple
    background: currentTheme.background || '#ffffff',
    cardBackground: currentTheme.cardBackground || '#ffffff',
    text: currentTheme.text || '#242424',
    secondaryText: currentTheme.secondaryText || '#757575',
    inputBackground: currentTheme.inputBackground || '#f5f5f5',
  }), [currentTheme]);

  useEffect(() => {
    setPostData([...state.posts, ...staticPosts]);
  }, [state.posts]);

  const toggleLike = useCallback((id) => {
    setPostData(prevPosts =>
      prevPosts.map(post =>
        post.id === id
          ? { ...post, likes: likedPosts.has(id) ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );

    setLikedPosts(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  }, [likedPosts]);

  const handleCommentPress = useCallback((id) => {
    setShowCommentInput(showCommentInput === id ? null : id);
    setCommentText('');
  }, [showCommentInput]);

  const navigationToComments = useCallback((postId) => {
    // This would navigate to a comments screen with the postId
    console.log(`Navigate to comments for post ${postId}`);
    // Uncomment if you have the navigation set up
    // navigation.navigate('Comments', { postId });
  }, []);

  const handleSubmitComment = useCallback((id) => {
    if (commentText.trim()) {
      // Update comments in state
      setComments(prev => {
        const postComments = prev[id] || [];
        return {
          ...prev,
          [id]: [...postComments, {
            id: Date.now().toString(),
            text: commentText,
            user: 'You',
            timestamp: new Date().toISOString()
          }]
        };
      });

      // Update comment count in post data
      setPostData(prevPosts =>
        prevPosts.map(post =>
          post.id === id
            ? { ...post, comments: (post.comments || 0) + 1 }
            : post
        )
      );

      setShowCommentInput(null);
      setCommentText('');
    }
  }, [commentText]);

  const renderStory = useCallback(({ item }) => (
    <StoryItem item={item} themeColors={themeColors} />
  ), [themeColors]);

  const renderPost = useCallback(({ item }) => (
    <PostItem
      item={item}
      likedPosts={likedPosts}
      toggleLike={toggleLike}
      showCommentInput={showCommentInput}
      handleCommentPress={handleCommentPress}
      commentText={commentText}
      setCommentText={setCommentText}
      handleSubmitComment={handleSubmitComment}
      themeColors={themeColors}
      navigationToComments={navigationToComments}
    />
  ), [likedPosts, toggleLike, showCommentInput, handleCommentPress, commentText, setCommentText, handleSubmitComment, themeColors, navigationToComments]);

  const keyExtractor = useCallback((item) => item.id, []);

  const renderHeader = useCallback(() => (
    <View style={styles.headerContent}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: themeColors.text }]}>
          UniHive
        </Text>
      </View>
      <FlatList
        data={stories}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderStory}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.storiesContainer}
      />
    </View>
  ), [themeColors, renderStory, keyExtractor]);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />
      <FlatList
        ref={flatListRef}
        data={postData}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.feedContainer}
        showsVerticalScrollIndicator={false}
        renderItem={renderPost}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={9}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  storiesContainer: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  storyContainer: {
    marginHorizontal: 8,
    alignItems: 'center',
    width: 72,
  },
  storyGradient: {
    padding: 3,
    borderRadius: 38,
  },
  storyImageContainer: {
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  storyImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  storyText: {
    fontSize: 12,
    marginTop: 4,
    width: '100%',
    textAlign: 'center',
    fontWeight: '500',
  },
  feedContainer: {
    paddingTop: 10,
  },
  postContainer: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profilePic: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
  },
  userTextContainer: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  userHandle: {
    fontSize: 12,
    marginTop: 1,
  },
  moreButton: {
    padding: 5,
  },
  postImage: {
    width: '100%',
    height: width * 0.9,
    backgroundColor: '#f5f5f5',
  },
  caption: {
    fontSize: 14,
    padding: 14,
    paddingTop: 12,
    paddingBottom: 6,
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  viewAllCommentsButton: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  viewAllCommentsText: {
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  commentProfilePic: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
  },
  commentInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});

export default HomeScreen;
