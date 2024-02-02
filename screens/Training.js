import React, { useState, useEffect } from "react";
import {
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Image, SafeAreaView, StyleSheet, Text, View, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS, FONTS } from "../constants";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const image_v_1 = require("../assets/images/training1.jpg");
const image_v_2 = require("../assets/images/training2.jpg");
const image_v_3 = require("../assets/images/training3.jpg");

import data from "../constants/training.json";

const Training = ({ navigation }) => {
  const [trainings, setTrainings] = useState(data.trainings);
  const [filteredTrainings, setFilteredTrainings] = useState(data.trainings);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userEmail = user.email;
            console.log("User Email:", userEmail);

            const usersSnapshot = await get(ref(getDatabase(), "users"));
            const usersData = usersSnapshot.val();
            console.log("Users Data:", usersData);

            if (usersData) {
              const currentUser = Object.values(usersData).find(
                (userData) => userData.email === userEmail
              );

              if (currentUser) {
                setFirstName(currentUser.firstName);
                setLastName(currentUser.lastName);
                setAge(currentUser.age);
                setEmail(currentUser.email);
                console.log("First Name:", currentUser.firstName);
                console.log("Last Name:", currentUser.lastName);
                console.log("Age:", currentUser.age);
                console.log("Email:", currentUser.email);
              }
            }
          }
        });

        const trainingSnapshot = await get(ref(getDatabase(), "trainings"));
        const trainingData = trainingSnapshot.val();

        if (trainingData) {
          setTrainings(trainingData);
          setFilteredTrainings(trainingData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImage = (id) => {
    if (id === 1) return image_v_1;
    if (id === 2) return image_v_2;
    if (id === 3) return image_v_3;
  };

  const searchTrainings = (keyword) => {
    const lowercasedKeyword = keyword.toLowerCase();
    const results = trainings.filter((training) => {
      return training.make.toLowerCase().includes(lowercasedKeyword);
    });

    setFilteredTrainings(results);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginTop:-5}}>
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Ionicons name="arrow-back-circle" size={55} color={COLORS.white} />
  </TouchableOpacity>
  <Text style={styles.titleText}>Cyclist Training List</Text>
</View>
    
    
      <View style={styles.listSection}>
      <Image
          source={require("../assets/images/header.png")}
          resizeMode="contain"
          style={styles.headerImage}
        />
        <Text style={styles.headerText}>Select Training:</Text>
        </View>
        <ScrollView style={{height: '100%', flex:1, marginTop:5, padding:30, }}>
          {filteredTrainings.map((training) => {
            return (
              <TouchableOpacity
                style={styles.element}
                key={training.id}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("DetailScreen", { id: training.id })
                }
              >
                  <ImageBackground
                    source={getImage(training.id)}
                    resizeMode="cover"
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: 14,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        ...StyleSheet.absoluteFillObject,
                        backgroundColor: "rgba(0, 0, 0, 0.25)", // Adjust opacity as needed
                      }}
                    />
                  </ImageBackground>
                  <View
                    style={{
                      position: "absolute",
                      bottom: 12,
                      left: 6,
                    }}
                  >
                    <View style={styles.infoArea}>
                    
                      <Text style={[styles.infoTitle]}>{training.make}</Text>
                      <Text style={styles.infoDetail}>
                        <Text style={styles.infoSub}>
                          {training.subtitle}{" "}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

    </SafeAreaView>
  );
};




const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    
  },

  listSection: {
    //marginTop: 65,
    backgroundColor: COLORS.background,
    
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: "space-between",
    //height: "100%"
  },
  title: {
    ...FONTS.h5,
    color: COLORS.black,
  },
  
  titleText: {
    marginTop:55,
    paddingLeft: windowWidth * 0.1,
    ...FONTS.h6,
    color: COLORS.white,
  },
  headerText: {
    marginTop:10,
    ...FONTS.h6,
    color: COLORS.white,
  },
  elementPallet: {
    marginTop: 25,
    paddingLeft: 0,
    paddingRight: 0,
    flex: 1,
  },
  startButton:{
    width: '85%',
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    paddingVertical: 5,
    borderWidth: 2,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    // width: 100,
  },
  startButtonId1:{
    width: '85%',
    backgroundColor: '#434E58',
    borderColor: '#434E58',
    // width: 100,
  },
  startButtonId2:{
    marginLeft:25,
  },
  headerSection: {
    paddingLeft: 30,
    paddingRight: 30,
   height: 125,
    width: "100%",
    position: "absolute",
  // flex:2,
    //justifyContent: "space-between",
    alignItems: "center",
  },
  firstName: {
    color: COLORS.primary,
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginHorizontal: 30,
    height: 50,
  },
  backButton: {
    marginTop: 40,
    paddingLeft:15,
  },
  headerImage: {
  bottom:15,
  marginTop:30,
  width:"100%",
  height: 120,
  },
  
  element: {
    height: 150,
    width: "100%",
    marginBottom: 30,
  },
  infoArea: {
    width: "100%",
    marginTop: 10,
  },
  infoTitle: {
    ...FONTS.h6,
    textAlign: "left",
    color: COLORS.white,
     padding:5,
    marginBottom: 15,
  },
  infoDetail: {
    position: "absolute",
    bottom: 0,
    fontSize: 10,
    color: "#696969",
    fontWeight: "bold",
    padding:5,
  },
  infoSub: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: "600",

  },
});
export default Training;