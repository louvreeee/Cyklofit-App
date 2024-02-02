import React, { useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, FlatList } from "react-native";
import { COLORS, FONTS } from "../constants";
import Button from "../components/Button";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const slides = [
  {
    id: '1',
    image: require('../assets/images/OB1.jpg'),
    title: 'Meet Your Virtual Training Assistant',
  },
  {
    id: '2',
    image: require('../assets/images/OB2.jpg'),
    title: 'Monitor Your Muscle Condition',
  },
  {
    id: '3',
    image: require('../assets/images/OB3.jpg'),
    title: 'Welcome, Lets Train Together',
  },
];

const Slide = ({ item }) => {
  return (
    <View style={styles.slideContainer}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );
};

const OnboardingScreen = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef();

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / windowWidth);
    setCurrentSlideIndex(currentIndex);
  };

  const Footer = () => {
    return (
      <View style={styles.footerContainer}>
        {currentSlideIndex === slides.length - 1 ? (
          <View style={styles.buttonContainer}>
            <Button
              title="Get Started"
              style={styles.btn}
              onPress={() => navigation.navigate("Login")}
            />
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={[styles.signupText, { color: COLORS.primary }]}> Signup</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index && { backgroundColor: COLORS.white, width: 20 },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({ item }) => <Slide item={item} />}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  slideContainer: {
    width: windowWidth,
    height: windowHeight * 0.75,
    justifyContent: "center",
    alignItems: "center",
  },
  
  image: {
    width: windowWidth * 1, 
    height: windowHeight * 0.8,
     flex:1,
  },
  title: {
    ...FONTS.h5,
    color: COLORS.white,
    fontWeight: "500",
    fontSize:windowHeight * 0.034,
    lineHeight: windowHeight * 0.05,
    paddingTop: windowHeight * 0.045,
    textAlign: "center",
   // maxWidth: "60%",
    maxWidth: windowWidth * 0.7,
 
  },
  footerContainer: {
    position: "absolute",
    bottom: windowHeight * 0.03,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
  //  width:"100%"
    width: windowWidth, 
  },
  btn: {
   // width: "90%",
   width: windowWidth * 0.9, 
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop:windowHeight * 0.01,
    paddingBottom:windowHeight * 0.02,
  },
  signupText: {
    ...FONTS.body3,
    color: COLORS.gray,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  indicator: {
    height: 6,
    width: 8,
    backgroundColor: "white",
    marginHorizontal: 3,
    borderRadius: 20,
  },

});
export default OnboardingScreen;
