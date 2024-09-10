import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native";
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "../constants";
import Button from '../components/ButtonNoBorder';
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const AlertScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigation = useNavigation();

  const establishConnection = async () => {
    try {
      const response = await axios.post('https://testdeploy-production-50d3.up.railway.app/establish-connection');
      console.log(response.data.message);
      await checkConnectionStatus();
    } catch (error) {
       console.log('Error establishing connection:', error);
    }
  };

  const checkConnectionStatus = async () => {
    // Show loading alert
    Alert.alert("Connecting...", "", [
      { text: "Cancel", onPress: () => cancelFunction(), style: "cancel" }
    ]);
  
    setIsLoading(true);
  
    try {
      const response = await axios.get('https://testdeploy-production-50d3.up.railway.app/connection-status');
      console.log('Connection status response:', response.data);
      setIsConnected(response.data.connected);
  
      // Close loading alert
      setIsLoading(false);
  
      if (response.data.connected) {
        // Show alert if connection is established
        Alert.alert("Connection established", "Connection to the server is successful.");
        navigation.navigate('CalibrateTraining');
      } else {
        // Show alert if connection is not established
        Alert.alert("Connection not established", "Please check your connection settings and try again.");
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
      // Close loading alert
      setIsLoading(false);
      // Show alert if connection fails
      Alert.alert("Connection failed", "There was an error checking the connection status.");
    }
  };
  
  const handleOkPress = async () => {
    setIsConnecting(true);
    await establishConnection();
    await checkConnectionStatus();
  };
  
  const cancelFunction = () => {
    // End all functions here
    setIsLoading(false);
    setIsConnecting(false);
  };
  
  
  return (
<View style={styles.mcontainer}>
    
    <View style={{
      flexDirection: 'row', justifyContent: 'left',
      marginBottom: 0, textAlign: 'left',
 }}>


 </View>

    <View style={styles.container}>
      <View
        style={styles.box}  >
        <Text style={styles.heading}>Hey there...</Text>
        <Text style={styles.paragraph}>It looks like your device needs calibration. Shall we calibrate it now?</Text>
        <View style={styles.buttonContainer}>
        <TouchableOpacity 
            style={[styles.btn, (isLoading || isConnecting) && styles.disabledBtn]} // Apply disabledBtn style when isLoading or isConnecting is true
            disabled={isLoading || isConnecting}
            onPress={handleOkPress}
          ><Button 
            title="OK"
          /></TouchableOpacity>
 <TouchableOpacity ><Button style={styles.btn2}
            title="Don't allow"
            onPress={() => navigation.navigate("Training")}
          /></TouchableOpacity>
          </View>
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
    padding:40,
    height: windowHeight * 0.8,
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
    paddingTop: 30,
    fontSize: windowHeight *0.032,
  },
  disabledBtn: {
    backgroundColor: COLORS.gray,
    borderColor: COLORS.gray, 
   },
  btn:{
    width: '35%',
    marginVertical: 8,
    borderColor: COLORS.primary,
    color:COLORS.primary,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn2:{
    width: '100%',
    marginVertical: 8,
    marginHorizontal:10,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#434E58',
    borderColor: '#434E58',

  },
  paragraph:{
    color:COLORS.gray,
    ...FONTS.body4,
    fontWeight: "300",
    paddingTop: 10,
    textAlign: "center",
    fontSize: windowHeight *0.022,
    width:windowWidth * 0.7,
  },
  buttonContainer: {
    alignItems: "center",
    width:"100%",
    padding:20,
    flexDirection: "row",
    justifyContent: 'space-around',
  },
  box: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.containerbox,
    borderRadius: 20, 
    width:'100%',
    height:windowHeight * 0.42,
    padding:20,
    },
  backButton: {
    marginTop: 35,
    paddingLeft:15,
    },
  });
  export default AlertScreen;