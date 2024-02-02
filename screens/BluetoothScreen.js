import { Pressable, StyleSheet, Text, View, TouchableOpacity, Dimensions} from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS, SIZES, images } from "../constants";
import axios from 'axios';
import Button from '../components/ButtonNoBorder';
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const BluetoothScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false); // Track connection process
    const navigation = useNavigation();

    const [currentState, setCurrentState] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Not Connected');
  const [isConnected, setIsConnected] = useState(false); // Track connection status as a boolean

  const establishConnection = async () => {
    try {
      const response = await axios.post('http://192.168.55.119:5000/establish-connection');
      console.log(response.data.message);
      await checkConnectionStatus(); // Check connection status after attempting to establish connection
    } catch (error) {
      console.error('Error establishing connection:', error);
    }
  };
  const checkConnectionStatus = async () => {
    try {
      const response = await axios.get('http://192.168.55.119:5000/connection-status');
      setIsConnected(response.data.connected); // Update isConnected based on the connection status
    } catch (error) {
      console.error('Error checking connection status:', error);
      setIsConnected(false); // Assume not connected on error
    }
  };

  const resetTimer = async () => {
    try {
      await axios.post('http://192.168.55.119:5000/reset-timer');
      setCurrentState('Timer Reset');
      // Optionally reset other states or variables as needed
    } catch (error) {
      console.error('Error resetting timer:', error);
    }
  };


  const setState1 = async () => {
    try {
      await axios.post('http://192.168.55.119:5000/set-state-1');
      setCurrentState(1);
    } catch (error) {
      console.error('Error setting state 1:', error);
    }
  };



  const setState2 = async () => {
    try {
      await axios.post('http://192.168.55.119:5000/set-state-2');
      setCurrentState(2);
    } catch (error) {
      console.error('Error setting state 2:', error);
    }
  };

  const setState3 = async () => {
    try {
      await axios.post('http://192.168.55.119:5000/set-state-3');
      setCurrentState(3);
    } catch (error) {
      console.error('Error setting state 3:', error);
    }
  };

  const getState = async () => {
    try {
      const response = await axios.get('http://192.168.55.119:5000/get-state');
      setCurrentState(response.data.state);
    } catch (error) {
      console.error('Error getting state:', error);
    }
  };

  const handleOkPress = async () => {
  //  setIsLoading(true);
    setIsConnecting(true); // Start connection process
    try {
      await establishConnection(); 
      await checkConnectionStatus(); // Wait for connection status check
      if (isConnected) {
        navigation.navigate('CalibrationScreen');
      } else {
        console.error('Connection not established.');
      }
    } catch (error) {
      console.error('Error establishing connection:', error);
    } finally {
      setIsLoading(false);
      setIsConnecting(false); // End connection process
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.box}  >
        <Text style={styles.heading}>Cyklofit Would Like to Connect to Server</Text>
        <Text style={styles.paragraph}>Cyklofit server would like to establish a connection with your device.</Text>
        <View style={styles.buttonContainer}>
        <TouchableOpacity 
            style={[styles.btn, (isLoading || isConnecting) && styles.disabledBtn]} // Apply disabledBtn style when isLoading or isConnecting is true
            disabled={isLoading || isConnecting}
            onPress={handleOkPress}
          ><Button
            title="OK"
            
          /></TouchableOpacity>
 <TouchableOpacity style={styles.btn2}><Button
            title="Don't allow"
            onPress={()=> navigation.goBack()}
          /></TouchableOpacity>
          </View>
       </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
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
    fontSize: windowHeight *0.031,
  },
  disabledBtn: {
    backgroundColor: COLORS.gray,
    borderColor: COLORS.gray, // Change the background color to gray when disabled
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
    width: '48%',
    marginVertical: 8,
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
    fontSize: windowHeight *0.023,
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
  
  });
  export default BluetoothScreen;