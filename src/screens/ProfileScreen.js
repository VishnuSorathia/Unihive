import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  StatusBar,
  Pressable,
  Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [badgesVisible, setBadgesVisible] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [business, setBusiness] = useState("");

  const userStats = { totalLikes: 1200, totalPosts: 35, competitionWins: 3 };

  const badges = [
    { name: "Top Performer", icon: "medal", color: "#3A3A3C" },
    { name: "Popular Creator", icon: "fire", color: "#2C2C2E" },
    { name: "Engagement Leader", icon: "users", color: "#3A3A3C" },
    { name: "Consistent Contributor", icon: "clock", color: "#2C2C2E" },
    { name: "Community Supporter", icon: "hand-holding-heart", color: "#3A3A3C" },
    { name: "Innovative Thinker", icon: "lightbulb", color: "#2C2C2E" },
  ];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const removeProfilePhoto = () => {
    setProfileImage(null);
  };

  const handleBackFromBadges = useCallback(() => {
    setBadgesVisible(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={profileImage ? { uri: profileImage } : require('../assets/default-avatar.png')}
              style={styles.profileImage}
              defaultSource={require('../assets/default-avatar.png')}
            />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{name || "User"}</Text>
            <Text style={styles.username}>@{username || "Username"}</Text>
            {business ? (
              <View style={styles.businessContainer}>
                <FontAwesome5 name="briefcase" size={12} color="#666" />
                <Text style={styles.business}>{business}</Text>
              </View>
            ) : null}
          </View>
        </View>
        
        <View style={styles.bioContainer}>
          <Text style={styles.bio}>{bio || ""}</Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={() => setEditing(true)} 
            style={styles.editProfileButton}
          >
            <FontAwesome5 name="user-edit" size={16} color="#FFF" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setBadgesVisible(true)} 
            style={styles.badgesButton}
          >
            <FontAwesome5 name="certificate" size={16} color="#2C2C2E" />
            <Text style={[styles.buttonText, {color: "#2C2C2E"}]}>Badges</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <FontAwesome5 name="heart" size={18} color="#555" />
            <Text style={styles.statValue}>{userStats.totalLikes}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statBox}>
            <FontAwesome5 name="images" size={18} color="#555" />
            <Text style={styles.statValue}>{userStats.totalPosts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statBox}>
            <FontAwesome5 name="trophy" size={18} color="#555" />
            <Text style={styles.statValue}>{userStats.competitionWins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
        </View>
        
        {/* Featured Posts Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Featured Posts</Text>
          <View style={styles.activityCard}>
            <Text style={styles.emptyStateText}>
              Your featured posts will appear here
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editing}
        onRequestClose={() => setEditing(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditing(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.modalImageSection}>
                <Image
                  source={profileImage ? { uri: profileImage } : require('../assets/default-avatar.png')}
                  style={styles.modalProfileImage}
                  defaultSource={require('../assets/default-avatar.png')}
                />
                
                <View style={styles.imageButtonsContainer}>
                  <TouchableOpacity onPress={pickImage} style={[styles.imageActionButton, {backgroundColor: "#2C2C2E"}]}>
                    <FontAwesome5 name="camera" size={14} color="#FFF" />
                    <Text style={styles.imageButtonText}>Change Photo</Text>
                  </TouchableOpacity>
                  
                  {profileImage && (
                    <TouchableOpacity onPress={removeProfilePhoto} style={[styles.imageActionButton, {backgroundColor: "#6C6C70"}]}>
                      <FontAwesome5 name="trash-alt" size={14} color="#FFF" />
                      <Text style={styles.imageButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter your username"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={styles.textArea}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us about yourself"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Business</Text>
                <TextInput
                  style={styles.input}
                  value={business}
                  onChangeText={setBusiness}
                  placeholder="Enter your business (optional)"
                />
              </View>
            </ScrollView>

            <TouchableOpacity onPress={() => setEditing(false)} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Badges Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={badgesVisible}
        onRequestClose={handleBackFromBadges}
      >
        <View style={styles.modalContainer}>
          <View style={styles.badgesModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Badges</Text>
              <TouchableOpacity onPress={handleBackFromBadges} style={styles.closeButton}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.badgesGrid}>
                {badges.map((badge, index) => (
                  <View key={index} style={styles.badgeItem}>
                    <LinearGradient
                      colors={[badge.color, '#4A4A4C']}
                      style={styles.badgeIconContainer}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <FontAwesome5 name={badge.icon} size={24} color="#FFF" />
                    </LinearGradient>
                    <Text style={styles.badgeText}>{badge.name}</Text>
                    <Text style={styles.badgeSubtext}>University Achievement</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2C2E',
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderWidth: 3, 
    borderColor: "#F0F0F0",
    backgroundColor: "#F8F8F8",
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  name: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 4,
    color: "#2C2C2E",
  },
  username: { 
    fontSize: 16, 
    marginBottom: 6,
    color: "#636366",
  },
  businessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  business: { 
    fontSize: 14, 
    fontWeight: '500',
    marginLeft: 4,
    color: "#636366",
  },
  bioContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 0,
    backgroundColor: "#FFFFFF",
  },
  bio: { 
    fontSize: 14, 
    lineHeight: 20,
    color: "#3A3A3C"
  },
  buttonContainer: { 
    flexDirection: "row", 
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
  },
  editProfileButton: { 
    flexDirection: 'row',
    backgroundColor: "#2C2C2E", 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8, 
    alignItems: "center", 
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  badgesButton: {
    flexDirection: 'row',
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  buttonText: { 
    color: "white", 
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 14,
  },
  statsContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statBox: { 
    alignItems: "center", 
    flex: 1 
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    color: "#2C2C2E",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    color: "#636366",
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EFEFEF',
    marginHorizontal: 10,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: "#2C2C2E",
  },
  activityCard: {
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    color: "#8E8E93",
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0, 0, 0, 0.5)" 
  },
  modalContent: { 
    backgroundColor: "#FFFFFF", 
    borderRadius: 12, 
    width: "90%",
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold",
    color: "#2C2C2E",
  },
  closeButton: {
    padding: 4,
  },
  modalScrollView: {
    maxHeight: '70%',
  },
  modalScrollContent: {
    padding: 20,
  },
  modalImageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#F0F0F0",
    backgroundColor: "#F8F8F8",
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  imageButtonText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
    color: "#2C2C2E",
  },
  input: { 
    width: "100%", 
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8, 
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#2C2C2E",
  },
  textArea: {
    width: "100%", 
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8, 
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    backgroundColor: "#FFFFFF",
    color: "#2C2C2E",
  },
  saveButton: { 
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16, 
    borderRadius: 8, 
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  saveButtonText: { 
    color: "white", 
    fontWeight: "bold",
    fontSize: 16,
  },
  badgesModal: { 
    backgroundColor: "white", 
    borderRadius: 12, 
    width: "90%",
    maxHeight: '80%',
    overflow: 'hidden',
  },
  badgesGrid: { 
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: { 
    width: '48%',
    alignItems: "center",
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  badgeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeText: { 
    fontSize: 14, 
    fontWeight: "bold",
    textAlign: 'center',
    color: "#2C2C2E",
    marginBottom: 4,
  },
  badgeSubtext: {
    fontSize: 12,
    textAlign: 'center',
    color: "#8E8E93",
  },
});

export default ProfileScreen;