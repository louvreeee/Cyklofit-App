import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from "../constants";
import axios from 'axios';

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const App = () => {
  const navigation = useNavigation();
  const [currentState, setCurrentState] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Not Connected');
  const [isConnected, setIsConnected] = useState(false); // Track connection status as a boolean

  const establishConnection = async () => {
    try {
      const response = await axios.post('http://192.168.55.119:5000/establish-connection');
      console.log(response.data.message);
      checkConnectionStatus(); // Check connection status after attempting to establish connection
    } catch (error) {
      console.error('Error establishing connection:', error);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const response = await axios.get('http://192.168.55.119:5000/connection-status');
      setIsConnected(response.data.connected); // Update isConnected based on the connection status
      setConnectionStatus(response.data.connected ? 'Established connection' : 'Not Connected');
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
   // if (isConnected) { // Only proceed if connected
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0); // Used to reset the timer
  const duration = 30; // Duration in seconds

  const handleReset = () => {
    resetTimer();
    setIsPlaying(false); // Stop the timer before resetting
    setKey(prevKey => prevKey + 1); // Increment key to reset the timer
  };

  const handlePlayPause = () => {
    if (!isPlaying) { // Check if the timer is not already playing
      setState1(); // Call setState1 only when starting the timer
    }
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };


  
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.background, flex: 1,}}>
        <View style={{marginVertical: 20, padding:20  }}>
      <View style={{ flexDirection: 'row', justifyContent: 'left',  paddingLeft:-5,paddingBottom:10,}}><TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-circle" size={55} color={COLORS.white} />
      </TouchableOpacity>
      <Text style={styles.headerText}>Device Calibration</Text>
      </View>



      <View style={[styles.container3]}>
      <View style={styles.timerWrapper}>
        <CountdownCircleTimer
          key={key}
          isPlaying={isPlaying}
          duration={duration}
          colors={[
                '#A50102','#A00102' 
              ]}
          size={SIZES.width * 0.7}
          strokeWidth={20}
          trailColor="#171725"
        >
          {({ remainingTime }) => (
            <Text style={styles.timeText}>{formatTime(remainingTime)}</Text>
          )}
        </CountdownCircleTimer>
        <View style={styles.controls}>
        <TouchableOpacity onPress={() => {
  setState1();
  handlePlayPause();
}}>
            <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={55} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReset}>
            <Ionicons name="refresh-circle" size={55} color={COLORS.white} />
          </TouchableOpacity>
         
        </View>
      </View>
 
      </View>
      </View>
    </SafeAreaView>
  );
}
  const styles = StyleSheet.create({

    container3: {
   //   flex:2,
      justifyContent: 'center',
      alignItems: 'center',
     // paddingTop: Constants.statusBarHeight,
      backgroundColor: COLORS.containerbox,
      borderRadius: 20, 
    //  padding: 20,
      height: windowHeight * 0.75,
      marginVertical: 10,
    },

  control:{
    marginTop: 100,
    flexDirection: 'row',
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  goBackButton: {
    marginVertical: 20,
    marginLeft: 20,
  },
  headerText: {
    ...FONTS.h6,
    color: COLORS.white,
    marginTop:20,
    marginLeft: windowWidth * 0.1,
  },
  timerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    ...FONTS.h1,
    color: COLORS.white,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 30,
    width: 110,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  
  });
  export default App;