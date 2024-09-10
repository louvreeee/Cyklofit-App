import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "../constants";
import Button from '../components/Button';
import LottieView from "lottie-react-native";
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const LoginSuccess = () => {
  const navigation = useNavigation();

  return (
<View style={styles.mcontainer}>

    <View style={styles.container}>
      <View
        style={styles.box}  >
        <LottieView
        style={{
          height: 140,
        }}
        source={require("../assets/animations/success.json")}
        autoPlay
        loop={false}
        speed={0.9}
      />
        {/*<Text style={{paddingTop:windowHeight * 0.01}}><Ionicons name="checkmark-circle" size={105} color={'#00C566'} /></Text>*/}
        <Text style={styles.heading}>Welcome aboard,{'\n'} Champion Cyclist</Text>
        <Text style={styles.paragraph}>Your login to Cyklofit was successful. You are now all set to dive into your cycling journey.</Text>
        
            <Button title="Continue" style={styles.btn}  onPress={() => navigation.navigate('BottomTabNavigation')}/>
         
       </View>
    </View>
    </View>
    
  );
}



const styles = StyleSheet.create({
  mcontainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",

  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding:30,
    height: windowHeight * 0.8,
  },
  box: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.containerbox,
    borderRadius: 20, 
    //width:'80%',
    height:windowHeight * 0.65,
    padding:20,
    },
  topheader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#171725",
    padding:30,
  },
  heading:{
    color:COLORS.white,
    ...FONTS.h5,
    textAlign: "center",
    paddingTop: 0,
    fontSize: windowHeight *0.032,
  },
  disabledBtn: {
    backgroundColor: COLORS.gray,
    borderColor: COLORS.gray, 
   },
  btn:{
    width: windowWidth * 0.6,
    fontSize: windowHeight * 0.3,
    marginVertical: 8,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: windowHeight * 0.075,
  },
  paragraph:{
    color:COLORS.gray,
    ...FONTS.body4,
    fontWeight: "300",
    paddingTop: 10,
    paddingBottom:10,
    textAlign: "center",
    fontSize: windowHeight *0.022,
    width:windowWidth * 0.7,
    padding:5,
  },
  buttonContainer: {
    alignItems: "center",
    width:"100%",
    padding:20,
    flexDirection:"column",
    justifyContent: 'center',
  },

  backButton: {
    marginTop: 35,
    paddingLeft:15,
    },
  });
  export default LoginSuccess;