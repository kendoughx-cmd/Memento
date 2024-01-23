// AddButton.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const AddButton = ({ onPress }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => navigation.navigate("PostScreen")}
    >
      <View style={styles.container}>
        <Text style={styles.text}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#D2B48C", // Brown color
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: "50%",
    marginLeft: -35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFF", // White color
  },
});

export default AddButton;
