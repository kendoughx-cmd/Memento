import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import moment from "moment";
import AddButton from "../components/AddButton";
import Icon from "react-native-vector-icons/MaterialIcons";

const { height: screenHeight } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPostIndices, setSelectedPostIndices] = useState([]);
  const [optionsTop, setOptionsTop] = useState(0);
  const flatListRef = useRef(null);

  const profileImageUrl =
    "https://th.bing.com/th/id/R.f07e48e3a8878b3e21784bf381e05b37?rik=T8yAUxrwcuMK6g&riu=http%3a%2f%2ftheselfiepost.com%2fwp-content%2fuploads%2f2018%2f07%2fScreen-Shot-2018-01-21-at-122216JPG.jpg&ehk=ZiMb%2fNFudid3ySEX3Y5DVHTDjt1%2bVziq21D0hwa4pNU%3d&risl=&pid=ImgRaw&r=0";

  useEffect(() => {
    // Initialize the selectedPostIndices array
    setSelectedPostIndices(new Array(posts.length).fill(false));
  }, [posts]);

  const addPost = useCallback(
    (newPost) => {
      const timestamp = moment().format("MMMM D, YYYY [at] h:mm A");
      setPosts((prevPosts) => [...prevPosts, `${timestamp}\n${newPost}`]);
      setSelectedPostIndices([...selectedPostIndices, false]);
    },
    [setPosts, selectedPostIndices, setSelectedPostIndices]
  );

  const deletePost = useCallback(
    (index) => {
      Alert.alert(
        "Delete Post",
        "Are you sure you want to delete this post?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => {
              setPosts((prevPosts) => prevPosts.filter((_, i) => i !== index));
              setSelectedPostIndices((prevIndices) =>
                prevIndices.filter((_, i) => i !== index)
              );
            },
          },
        ],
        { cancelable: false }
      );
    },
    [setPosts, setSelectedPostIndices]
  );

  const navigateToEditScreen = useCallback(
    (index) => {
      navigation.navigate("EditPostScreen", {
        editPostIndex: index,
        currentPostText: posts[index],
        onPostEdit: (editedPostText) => handlePostEdit(index, editedPostText),
      });
      setSelectedPostIndices((prevIndices) =>
        prevIndices.map((_, i) => (i === index ? true : false))
      );
    },
    [navigation, posts, setSelectedPostIndices]
  );

  const handlePostEdit = useCallback(
    (index, editedPostText) => {
      setPosts((prevPosts) =>
        prevPosts.map((post, i) => (i === index ? editedPostText : post))
      );
      setSelectedPostIndices((prevIndices) =>
        prevIndices.map((_, i) => (i === index ? true : false))
      );
    },
    [setPosts, setSelectedPostIndices]
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const firstVisibleIndex = viewableItems[0].index;
      const optionsTop =
        firstVisibleIndex === posts.length - 1
          ? Math.max(viewableItems[0].itemY - 120, 0)
          : Math.min(
              viewableItems[0].itemY + viewableItems[0].itemHeight + 8,
              screenHeight - 120
            );

      setOptionsTop(optionsTop);
    }
  });

  const toggleOptions = useCallback(
    (index) => {
      setSelectedPostIndices((prevIndices) =>
        prevIndices.map((_, i) => (i === index ? !prevIndices[i] : false))
      );

      if (index >= 0 && flatListRef.current) {
        flatListRef.current.scrollToIndex({ index, animated: true });

        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index, animated: true });
          }
        }, 300); // Adjust the delay based on your app's performance
      }
    },
    [selectedPostIndices, setSelectedPostIndices, flatListRef]
  );

  const renderOptions = (index) => {
    if (selectedPostIndices[index]) {
      return (
        <View style={[styles.optionsContainer, { top: optionsTop }]}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigateToEditScreen(index)}
          >
            <Text style={styles.optionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => deletePost(index)}
          >
            <Text style={styles.optionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Memeto</Text>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.profileImage}
          />
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(_, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        ListEmptyComponent={
          <Text style={styles.noPostsText}>No posts yet</Text>
        }
        renderItem={({ item, index, separators }) => {
          const postLines = item.split("\n");
          const timestamp = postLines[0];
          const title = postLines.length > 2 ? postLines[1] : null;
          const content = postLines
            .slice(title ? 2 : 1)
            .join("\n")
            .trim();

          return (
            <View style={styles.postContainer}>
              <Text style={styles.timestampText}>{timestamp}</Text>
              {title && <Text style={styles.titleText}>{title}</Text>}
              <View style={styles.postContent}>
                <Text style={styles.postText}>{content}</Text>
                <TouchableOpacity onPress={() => toggleOptions(index)}>
                  <Icon name="more-vert" size={20} color="#333" />
                </TouchableOpacity>
                {renderOptions(index)}
              </View>
            </View>
          );
        }}
      />

      <AddButton
        onPress={() => navigation.navigate("PostScreen", { addPost })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  postContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  postContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postText: {
    fontSize: 16,
    color: "#333",
  },
  timestampText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 6,
  },
  optionsContainer: {
    position: "absolute",
    right: 16,
    backgroundColor: "#fff",
    elevation: 4,
    borderRadius: 4,
    padding: 8,
  },
  optionButton: {
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  noPostsText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});

export default HomeScreen;
