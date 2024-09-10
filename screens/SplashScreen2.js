import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants";

const SplashScreen2 = () => {
  
  const { navigate } = useNavigation();
  setTimeout(() => {
    navigate("Onboarding");
  }, 4000);
  return (
    <View style={styles.container}>
      <LottieView
        style={{
          height: 120,
        }}
        source={require("../assets/animations/bike.json")}
        autoPlay
        loop
      />
    </View>
  );
};

export default SplashScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.background,
    alignContent: "center",
    justifyContent: "center",
  },
});
