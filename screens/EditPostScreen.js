// EditPostScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Header from "../components/Header";
import ActionButton from "../components/ActonButton";
import moment from "moment";

const EditPostScreen = ({ route, navigation }) => {
  const { editPostIndex, currentPostText, onPostEdit } = route.params;

  const lines = currentPostText.split("\n");
  const initialTitle = lines.length > 1 ? lines[1] : "";
  const initialText = lines.slice(2).join("\n");

  const [editedTitle, setEditedTitle] = useState(initialTitle);
  const [editedTitleStyle, setEditedTitleStyle] = useState({
    fontWeight: "bold",
  });
  const [editedText, setEditedText] = useState(initialText);

  useEffect(() => {
    setEditedTitle(initialTitle);
    setEditedText(initialText);
  }, [initialTitle, initialText]);

  const handleSave = () => {
    const timestamp = moment().format("MMMM D, YYYY [at] h:mm A");
    const updatedPost = `${timestamp}\n${editedTitle}\n${editedText}`;
    onPostEdit(updatedPost);

    // Check if the edited title is not equal to initialTitle before setting bold style
    setEditedTitleStyle({
      fontWeight: editedTitle !== initialTitle ? "bold" : "normal",
    });

    // Pass the edited title and style back to the parent component
    navigation.goBack({
      editedTitle,
      editedTitleStyle,
      timestamp, // Pass the timestamp back to the parent component
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Header title="Edit Journal Entry" onPress={() => navigation.goBack()} />

      <View style={styles.titleContainer}>
        <TextInput
          style={[styles.titleInput, editedTitleStyle]}
          placeholder="Edit the title..."
          value={editedTitle}
          onChangeText={(text) => setEditedTitle(text)}
        />
      </View>

      <TextInput
        style={styles.postInput}
        placeholder="Edit your journal entry here..."
        multiline
        value={editedText}
        onChangeText={(text) => setEditedText(text)}
      />

      <ActionButton onPress={handleSave} title="Save" color="#8B4513" />
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
    color: "#333",
  },
  titleContainer: {
    marginBottom: 20,
    width: "100%",
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
    fontWeight: "bold", // Ensure the bold style is applied
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

export default EditPostScreen;
