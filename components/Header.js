// components/Header.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const Header = ({ title, onPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPress} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#555" />
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = {
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
};

export default Header;
