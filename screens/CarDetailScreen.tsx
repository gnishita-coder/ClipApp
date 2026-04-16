import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";

const CarDetailScreen = () => {
  const route = useRoute();
  const { car } = route.params;

  return (
    <View style={styles.container}>
      <Image source={car.image} style={styles.image} />
      <Text style={styles.title}>Car Details</Text>
      {/* Add more details about the car here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20, 
    },
    title: {       
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default CarDetailScreen;