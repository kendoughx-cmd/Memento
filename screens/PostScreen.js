// PostScreen.js
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Header from "../components/Header";
import ActionButton from "../components/ActonButton";

const PostScreen = ({ route, navigation }) => {
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");

  const handlePost = () => {
    try {
      const newPost = postTitle ? `${postTitle}\n${postText}` : postText;
      console.log("Posted:", newPost);
      route.params.addPost(newPost);
      navigation.goBack();
    } catch (error) {
      console.error("Error posting:", error.message);
      // You can show an error message to the user if needed
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Header title="New Journal Entry" onPress={() => navigation.goBack()} />

      <TextInput
        style={styles.titleInput}
        placeholder="Enter the title..."
        value={postTitle}
        onChangeText={(text) => setPostTitle(text)}
      />

      <TextInput
        style={styles.postInput}
        placeholder="Write your journal entry here..."
        multiline
        value={postText}
        onChangeText={(text) => setPostText(text)}
      />

      <ActionButton onPress={handlePost} title="Post" color="#8B4513" />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  titleInput: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    fontWeight: "bold",
  },
  postInput: {
    width: "100%",
    height: 150,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
});

export default PostScreen;
