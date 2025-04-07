import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Animated,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  Linking
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { usePosts } from "../context/PostContext";
import uuid from "react-native-uuid";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const UploadScreen = () => {
  const { dispatch } = usePosts();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [caption, setCaption] = useState("");
  const [competitionType, setCompetitionType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Animation values
  const uploadButtonScale = useState(new Animated.Value(1))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  const competitions = [
    "Photography",
    "Video Editing",
    "Creative Art",
    "Digital Design",
    "Animation",
    "Short Film",
    "Music Production",
    "Content Creation"
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Add keyboard listeners
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Only open picker if not already in modal state and no media selected
      if (!modalVisible && !selectedMedia) {
        pickMedia();
      }
      return () => {};
    }, [modalVisible, selectedMedia])
  );

  const handlePressIn = () => {
    Animated.spring(uploadButtonScale, {
      toValue: 0.95,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(uploadButtonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const pickMedia = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          "Permission Required",
          "We need access to your media library to continue.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Settings", onPress: () => openAppSettings() }
          ]
        );
        return;
      }

      setIsLoading(true);

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
        aspect: [4, 3],
      });

      setIsLoading(false);

      if (!result.canceled) {
        if (result.assets[0].duration && result.assets[0].duration > 120) {
          Alert.alert("Duration Limit", "Videos should be 2 minutes or shorter for optimal sharing.");
          return;
        }
        setSelectedMedia(result.assets[0].uri);
        setMediaType(result.assets[0].type || (result.assets[0].uri.endsWith('.mp4') ? 'video' : 'image'));
        setModalVisible(true);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Something went wrong when accessing your media. Please try again.");
    }
  };

  // Helper to open app settings (for permissions)
  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const countWords = (text) => {
    const words = text.trim().split(/\s+/);
    return words[0] === "" ? 0 : words.length;
  };

  const handleCaptionChange = (text) => {
    setCaption(text);
    setWordCount(countWords(text));
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const selectCompetitionType = (type) => {
    setCompetitionType(type);
    setTimeout(() => {
      dismissKeyboard();
    }, 100);
  };

  const handleSubmit = () => {
    if (!uploadType) {
      Alert.alert("Missing Info", "Please select an upload type.");
      return;
    }

    if (!caption) {
      Alert.alert("Missing Caption", "Please add a caption to your post.");
      return;
    }

    if (wordCount > 10) {
      Alert.alert("Caption Too Long", "Please keep your caption to 10 words or less.");
      return;
    }

    if (uploadType === "competition" && !competitionType) {
      Alert.alert("Competition Type", "Please select a competition category.");
      return;
    }

    // Dismiss keyboard if it's visible
    dismissKeyboard();
    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      try {
        const newPost = {
          id: uuid.v4(),
          type: uploadType,
          category: uploadType === "competition" ? competitionType : null,
          file: selectedMedia,
          likes: 0,
          caption,
          timestamp: new Date().toISOString(),
        };

        dispatch({ type: "ADD_POST", payload: newPost });

        if (uploadType === "business" || uploadType === "competition") {
          dispatch({ type: "ADD_STORY", payload: newPost });
        }

        setIsLoading(false);
        Alert.alert(
          "Success",
          "Your content has been uploaded successfully!",
          [{ text: "OK", onPress: () => {
            setModalVisible(false);
            resetForm();
            // Navigate back to home or feed
            try {
              navigation.navigate('Home');
            } catch (error) {
              console.log("Navigation error:", error);
            }
          }}]
        );
      } catch (error) {
        setIsLoading(false);
        Alert.alert("Upload Failed", "There was an issue uploading your post. Please try again.");
      }
    }, 1000);
  };

  const resetForm = () => {
    setSelectedMedia(null);
    setUploadType("");
    setCaption("");
    setCompetitionType("");
    setWordCount(0);
  };

  const closeModal = () => {
    dismissKeyboard();
    setModalVisible(false);
    resetForm();
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Animated.View
        style={[
          styles.contentContainer,
          { opacity: fadeAnim }
        ]}
      >
        {isLoading && !modalVisible && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6200EA" />
            <Text style={styles.loadingText}>Processing media...</Text>
          </View>
        )}
      </Animated.View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeModal} style={styles.backButton}>
                <Text style={styles.backButtonText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>New Post</Text>
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.postButton,
                  (!uploadType || (uploadType === "competition" && !competitionType))
                    ? styles.disabledButton
                    : {}
                ]}
                disabled={!uploadType || (uploadType === "competition" && !competitionType)}
              >
                <Text style={[
                  styles.postButtonText,
                  (!uploadType || (uploadType === "competition" && !competitionType))
                    ? styles.disabledButtonText
                    : {}
                ]}>Post</Text>
              </TouchableOpacity>
            </View>

            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.modalContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {selectedMedia && mediaType === "image" && (
                  <Image source={{ uri: selectedMedia }} style={styles.imagePreview} resizeMode="cover" />
                )}

                {selectedMedia && mediaType === "video" && (
                  <View style={styles.videoPreviewContainer}>
                    <Image source={require('../assets/video-placeholder.png')} style={styles.videoPlaceholder} />
                    <Text style={styles.videoText}>Video Selected</Text>
                  </View>
                )}

                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Upload Type</Text>
                  <View style={styles.optionsContainer}>
                    <TouchableOpacity
                      onPress={() => setUploadType("personal")}
                      style={[
                        styles.optionButton,
                        uploadType === "personal" && styles.selectedOption
                      ]}
                    >
                      <Text style={[
                        styles.optionText,
                        uploadType === "personal" && styles.selectedOptionText
                      ]}>Personal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setUploadType("business")}
                      style={[
                        styles.optionButton,
                        uploadType === "business" && styles.selectedOption
                      ]}
                    >
                      <Text style={[
                        styles.optionText,
                        uploadType === "business" && styles.selectedOptionText
                      ]}>Business</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setUploadType("competition")}
                      style={[
                        styles.optionButton,
                        uploadType === "competition" && styles.selectedOption
                      ]}
                    >
                      <Text style={[
                        styles.optionText,
                        uploadType === "competition" && styles.selectedOptionText
                      ]}>Competition</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {uploadType === "competition" && (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Competition Category</Text>
                    <View style={styles.competitionContainer}>
                      {competitions.map((comp, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => selectCompetitionType(comp)}
                          style={[
                            styles.competitionItem,
                            competitionType === comp && styles.selectedCompetition
                          ]}
                        >
                          <Text style={[
                            styles.competitionText,
                            competitionType === comp && styles.selectedCompetitionText
                          ]}>{comp}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Caption</Text>
                  <View style={styles.captionContainer}>
                    <TextInput
                      placeholder="What's the story behind this content?"
                      value={caption}
                      onChangeText={handleCaptionChange}
                      multiline
                      style={styles.captionInput}
                      returnKeyType="done"
                      onSubmitEditing={dismissKeyboard}
                      blurOnSubmit={true}
                    />
                    <View style={styles.captionFooter}>
                      <Text style={[
                        styles.wordCount,
                        wordCount > 10 ? styles.wordCountExceeded : null
                      ]}>
                        {wordCount}/10 words
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Extra space at bottom to ensure scrolling doesn't cut off content */}
                <View style={styles.bottomSpacer} />
              </ScrollView>
            </TouchableWithoutFeedback>

            {isLoading && (
              <View style={styles.fullscreenLoading}>
                <View style={styles.loadingCard}>
                  <ActivityIndicator size="large" color="#6200EA" />
                  <Text style={styles.loadingCardText}>Uploading your content...</Text>
                </View>
              </View>
            )}
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6200EA",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#333333",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    flex: 1,
    textAlign: "center",
  },
  postButton: {
    padding: 8,
    backgroundColor: "#6200EA",
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
  },
  disabledButtonText: {
    color: "#9E9E9E",
  },
  modalContent: {
    padding: 16,
  },
  imagePreview: {
    width: "100%",
    height: width * 0.8,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: "#F0F0F0",
  },
  videoPreviewContainer: {
    width: "100%",
    height: width * 0.8,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlaceholder: {
    width: 64,
    height: 64,
    marginBottom: 12,
  },
  videoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200EA",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  selectedOption: {
    backgroundColor: "#EDE7F6",
    borderColor: "#6200EA",
  },
  optionText: {
    fontSize: 14,
    color: "#555555",
  },
  selectedOptionText: {
    color: "#6200EA",
    fontWeight: "bold",
  },
  competitionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginHorizontal: -6,
  },
  competitionItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginHorizontal: 6,
    marginBottom: 12,
  },
  competitionText: {
    fontSize: 14,
    color: "#555555",
  },
  selectedCompetition: {
    backgroundColor: "#EDE7F6",
    borderColor: "#6200EA",
  },
  selectedCompetitionText: {
    color: "#6200EA",
    fontWeight: "bold",
  },
  captionContainer: {
    position: "relative",
  },
  captionInput: {
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
    minHeight: 100,
    maxHeight: 150,
    textAlignVertical: "top",
  },
  captionFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 8,
  },
  wordCount: {
    fontSize: 14,
    color: "#999999",
  },
  wordCountExceeded: {
    color: "#F44336",
  },
  bottomSpacer: {
    height: 120, // Add extra space at the bottom for better scrolling
  },
  fullscreenLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 20,
  },
  loadingCard: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  loadingCardText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
});

export default UploadScreen;
