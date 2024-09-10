import React, { useState, useEffect } from "react";
import {
  ScrollView,
  ImageBackground,
  TouchableOpacity,Image, SafeAreaView, StyleSheet, Text, View,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS, FONTS, SIZES} from "../constants";
import { getDatabase, ref, get, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Button from "../components/Buttonsm";
import LinearGradient from 'react-native-linear-gradient';
import data from "../constants/mode.json";

const image_v_1 = require("../assets/images/m-1.png");
const image_v_2 = require("../assets/images/m-2.png");

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const ModeElement = ({ mode, navigation, image }) => {
  const navigateToScreen = (screen) => {
    navigation.navigate(screen);
  };

  const getGradientColors = () => {
    if (mode.id === 1) {
      return ['#8E1515', '#350303']; // Gradient colors for mode1
    } else if (mode.id === 2) {
      return ['#2F3C47', '#0C0C1E']; // Gradient colors for mode2
    }
    // Default gradient colors if mode.id is neither 1 nor 2
    return ['#4A4A65', '#111111'];
  };

  return (
    <TouchableOpacity
      style={[
        
      ]}
      activeOpacity={0.8}
      onPress={() =>
        navigateToScreen(mode.id === 1 ? 'BluetoothScreen' : 'Training')
      }
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{x: 1, y: 0}}
      end={{x: 1, y: 1}}
        style={[
          styles.element,
          mode.id === 1 ? styles.elementId1 : styles.elementId2,
        ]}
      >
        <View style={styles.imageArea}>
          <Image
            source={image}
            resizeMode="contain"
            style={[
              styles.modeImage,
              mode.id === 1 ? styles.modeImageId1 : styles.modeImageId2,
            ]}
          />
        </View>
        <View
          style={[
            styles.modeContainer,
            mode.id === 1 ? styles.modeContainerId1 : styles.modeContainerId2,
            {
              position: 'absolute',
              bottom: mode.id === 1 ? 12 : 60,
            },
          ]}
        >
          <View
            style={[
              styles.infoArea,
              mode.id === 1 ? styles.infoAreaId1 : styles.infoAreaId2,
            ]}
          >
            <Text
              style={[
                styles.infoTitle,
                mode.id === 1 ? styles.infoTitleId1 : styles.infoTitleId2,
              ]}
            >
              {mode.make}
            </Text>
            <TouchableOpacity
  style={{
    ...styles.startButton,
    ...(mode.id === 1 ? styles.startButtonId1 : styles.startButtonId2),
  
  }}
  onPress={() =>
    navigateToScreen(mode.id === 1 ? 'BluetoothScreen' : 'Training')
  }
>
  <Text style={{ ...FONTS.body3, color: COLORS.white, fontSize:windowHeight* 0.02 }}>Start</Text>
</TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};


const HomeScreen = ({ navigation }) => {
  const [modes, setModes] = useState(data.modes);
  const [filteredModes, setFilteredModes] = useState(data.modes);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        console.log("User UID:", userId);

        const userRef = ref(getDatabase(), `users/${userId}`);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          console.log("User Data:", userData);

          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(userData.email);
        }

        // Set up a listener for real-time updates
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            console.log('Real-time User Data:', userData);
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setEmail(userData.email);
          }
        });
      }
    });

    return () => {
      // Unsubscribe when the component unmounts
      unsubscribe();
    };
  }, []);


  return (
    <SafeAreaView style={styles.safeArea}>
      {/*<BottomTabNavigation />*/}
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <ImageBackground
            source={require("../assets/images/hero1.jpg")}
            style={{ width:'120%', height: hp(60), overflow:"hidden", marginTop:80 }}
          />
        </View>
        <SafeAreaView style={{}}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons
              name="arrow-back-circle"
              size={55}
             
              color={COLORS.white}
            />
          </TouchableOpacity>
          <View style={styles.titleSection}>
          <Text style={styles.title}>
            Hello{" "}
            <Text style={styles.firstName}>{firstName || "Guest"}</Text>, {"\n"}
            Have you trained today?
            </Text>
          </View>
        </SafeAreaView>
        <View style={styles.topSection}><Text style={styles.headerText}>Select Mode:</Text></View>
        <ScrollView style={{flex:1}}>
        <View style={styles.listSection}>
          <View style={[styles.elementPallet]}>
            {filteredModes.map((mode) => {
              const image = mode.id === 1 ? image_v_1 : image_v_2;
              return (
                <ModeElement
                  key={mode.id}
                  mode={mode}
                  navigation={navigation}
                  image={image}
                />
              );
            })}
          </View>
          
        </View>
</ScrollView>

      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
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
  },
  startButtonId1:{
    width: '85%',
    backgroundColor: '#434E58',
    borderColor: '#434E58',
  },
  startButtonId2:{
    marginLeft:25,
  },
  headerSection: {
    height: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    ...FONTS.h5,
   fontSize: windowHeight * 0.037,
    color: COLORS.white,
  },
  firstName: {
    color: COLORS.primary,
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop:30,
    marginHorizontal: 30,
    marginBottom:0,
    height: 60,
  
  },
 modeContainerId1: {
    alignItems: "center",
    width: '73%',
  },
  modeContainerId2: {
      alignItems: "center",
     marginLeft: windowWidth * 0.197,
      width: '73%',
    },
    topSection: {
      marginTop: 30,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop:30,
      backgroundColor: COLORS.background,
      justifyContent: "space-between",
      position:'relative',
    },
  listSection: {
    marginTop: 0,
    backgroundColor: COLORS.background,
    paddingLeft: 30,
    paddingRight: 30,
   justifyContent: "space-between",
    height:'100%',
    position:'relative',
    paddingBottom:60
  },
  titleText: {
    marginTop:55,
    paddingLeft: 70,
    ...FONTS.h6,
    color: COLORS.white,
  },
  headerText: {
    marginTop:-8,
    ...FONTS.body2,
    color: COLORS.white,
    fontSize: windowHeight * 0.028,
  },
  elementPallet: {
    marginTop: 25,
    paddingLeft: 0,
    paddingRight: 0,
    height: "100%",
    flex:1,
    paddingBottom:20,
  },
  element: {
    height: 160,
    width: "100%",
    marginBottom: 50,
    borderRadius: 10,
  },
  elementId1: {
    height: 160,
    width: "100%",
    marginBottom: 60,
    borderRadius: 10,
  },
  infoAreaId1: {
    width: "85%",
    marginTop: 0,
    marginBottom: 15,
    paddingLeft: 10,
  },
  infoAreaId2: {
    width: "85%",
    marginBottom: -30,
    paddingLeft: 10,
  },
  infoTitle: {
    ...FONTS.body2,
    textAlign: "left",
    color: COLORS.white,
     padding:5,
    marginBottom: 15,
    fontSize: windowHeight * 0.023,
  },
  infoTitleId2: {
    ...FONTS.body2,
    fontSize: windowHeight * 0.023,
    textAlign: "right",
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
  imageArea: {
    flex: 1,
  },
  modeImageId1: {
    position: "absolute",
    top: -35,
    left: 25,
    width: "150%",
    height: "150%",
  },
  modeImageId2: {
    position: "absolute",
    top: -35,
    right: 25,
    width: "150%",
    height: "150%",
  },
  headerImage: {
    bottom:15,
    width: "100%",
    height: "100%",
  },
  infoSub: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: "600",

  },
  backButton: {
    marginTop: -20,
    paddingLeft:15,
  },
});
