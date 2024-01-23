import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import moment from "moment";
import AddButton from "../components/AddButton";
import Icon from "react-native-vector-icons/MaterialIcons";

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [optionsTop, setOptionsTop] = useState(0);
  const flatListRef = useRef(null);

  const profileImageUrl =
    "https://th.bing.com/th/id/R.f07e48e3a8878b3e21784bf381e05b37?rik=T8yAUxrwcuMK6g&riu=http%3a%2f%2ftheselfiepost.com%2fwp-content%2fuploads%2f2018%2f07%2fScreen-Shot-2018-01-21-at-122216JPG.jpg&ehk=ZiMb%2fNFudid3ySEX3Y5DVHTDjt1%2bVziq21D0hwa4pNU%3d&risl=&pid=ImgRaw&r=0";

  const addPost = useCallback(
    (newPost) => {
      const timestamp = moment().format("MMMM D, YYYY [at] h:mm A");
      setPosts((prevPosts) => [...prevPosts, `${timestamp}\n${newPost}`]);
    },
    [setPosts]
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
              setSelectedPostIndex(null);
            },
          },
        ],
        { cancelable: false }
      );
    },
    [setPosts, setSelectedPostIndex]
  );

  const navigateToEditScreen = useCallback(
    (index) => {
      navigation.navigate("EditPostScreen", {
        editPostIndex: index,
        currentPostText: posts[index],
        onPostEdit: (editedPostText) => handlePostEdit(index, editedPostText),
      });
      setSelectedPostIndex(null);
    },
    [navigation, posts]
  );

  const handlePostEdit = useCallback(
    (index, editedPostText) => {
      setPosts((prevPosts) =>
        prevPosts.map((post, i) => (i === index ? editedPostText : post))
      );
      setSelectedPostIndex(null);
    },
    [setPosts, setSelectedPostIndex]
  );

  const toggleOptions = useCallback(
    (index) => {
      if (selectedPostIndex === index) {
        // If the same post is clicked again, close the options
        setSelectedPostIndex(null);
      } else {
        // Open the options for the selected post
        setSelectedPostIndex(index);

        if (index >= 0 && flatListRef.current) {
          flatListRef.current.scrollToIndex({ index, animated: true });

          setTimeout(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({ index, animated: true });
            }
          }, 300); // Adjust the delay based on your app's performance
        }
      }
    },
    [selectedPostIndex, setSelectedPostIndex, flatListRef]
  );

  const handleItemLayout = (event, index) => {
    if (index === selectedPostIndex) {
      const optionsTop =
        index === posts.length - 1
          ? event.nativeEvent.layout.y - 120
          : event.nativeEvent.layout.y + event.nativeEvent.layout.height + 8;

      setOptionsTop(optionsTop);
    }
  };

  const renderOptions = () => {
    if (selectedPostIndex !== null) {
      return (
        <View style={[styles.optionsContainer, { top: optionsTop }]}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigateToEditScreen(selectedPostIndex)}
          >
            <Text style={styles.optionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => deletePost(selectedPostIndex)}
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
        ListEmptyComponent={
          <Text style={styles.noPostsText}>No posts yet</Text>
        }
        renderItem={({ item, index }) => {
          const postLines = item.split("\n");
          const timestamp = postLines[0];
          const title = postLines.length > 2 ? postLines[1] : null;
          const content = postLines
            .slice(title ? 2 : 1)
            .join("\n")
            .trim();

          return (
            <View
              style={styles.postContainer}
              onLayout={(event) => handleItemLayout(event, index)}
            >
              <Text style={styles.timestampText}>{timestamp}</Text>
              {title && <Text style={styles.titleText}>{title}</Text>}
              <View style={styles.postContent}>
                <Text style={styles.postText}>{content}</Text>
                <TouchableOpacity onPress={() => toggleOptions(index)}>
                  <Icon name="more-vert" size={20} color="#333" />
                </TouchableOpacity>
                {renderOptions()}
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
    flexDirection: "column",
    position: "relative",
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
