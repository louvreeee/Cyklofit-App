import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Alert } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from "../constants";
import axios from 'axios';

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const App = () => {
  const navigation = useNavigation();
  const [currentState, setCurrentState] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0); // Used to reset the timer
  const duration = 30; // Duration in seconds

  const resetTimer = async () => {
    try {
      await axios.post('https://testdeploy-production-50d3.up.railway.app/reset-timer');
      setCurrentState('Timer Reset');
      setIsPlaying(false); // Stop the timer
      setKey(prevKey => prevKey + 1); // Increment key to reset the timer
    } catch (error) {
      console.log('Error resetting timer:', error);
    }
  };

  const setState1 = async () => {
    try {
      await axios.post('https://testdeploy-production-50d3.up.railway.app/set-state-1');
      setCurrentState(1);
    } catch (error) {
      console.log('Error setting state 1:', error);
    }
  };

  const handleReset = () => {
    resetTimer();
  };

  const handlePlay = () => {
    if (!isPlaying) {
      setState1(); 
    }
    setIsPlaying(true); 
  };
  
  const handleTimeElapsed = () => {
    console.log("Timer elapsed"); 
    setIsPlaying(false); 
    Alert.alert(
      "Time’s Up",
      "Do you want to keep the calibration data?",
      [
        {
          text: "Try Again",
          onPress: () => {
            setKey(prevKey => prevKey + 1); 
          },
          style: "cancel"
        },
        {
          text: "Save",
          onPress: async () => {
            try {
              const response = await axios.post('https://testdeploy-production-50d3.up.railway.app/set-save-flag', { save: true });
              console.log("Flag set to save thresholds. Proceeding with calibration.", response.data.message);
              // Add any further actions here, if necessary, to proceed with calibration
               // Then, send a confirmation to save the data
              await axios.post('https://testdeploy-production-50d3.up.railway.app/confirm-save');
              Alert.alert("Success", "Calibration data saved successfully.");
            } catch (error) {
              console.error("Error setting save flag:", error);
              Alert.alert("Error", "Failed to set the save flag.");
            }
          }
        }
      ]
    );
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };


  const handleGoBack = () => {
    if (isPlaying) {
   
      Alert.alert(
        "Going back is not possible yet.",
        "The timer is still running. Please wait until it is done.",
        [{ text: "OK", onPress: () => console.log("Alert closed") }]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.background, flex: 1 }}>
      <View style={{ flexDirection: 'row', marginTop:-5}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack} 
        >
          <Ionicons name="arrow-back-circle" size={55} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Device Calibration</Text>
      </View>
      <View style={{ marginVertical: 0, padding: 30 }}>
        <View style={[styles.container3]}>
          <View style={styles.timerWrapper}>
            <CountdownCircleTimer
              key={key}
              isPlaying={isPlaying}
              duration={duration}
              colors={['#A50102', '#A00102']}
              size={SIZES.width * 0.6}
              strokeWidth={17}
              trailColor="#171725"
              onComplete={handleTimeElapsed}
              isLinearGradient={true} 
              strokeLinecap="round" 
            >
              {({ remainingTime }) => (
                <Text style={styles.timeText}>{formatTime(remainingTime)}</Text>
              )}
            </CountdownCircleTimer>
            <View style={styles.controls}>
              <TouchableOpacity onPress={isPlaying ? null : handlePlay} disabled={isPlaying}>
                <Ionicons name={"play-circle"} size={55} color={isPlaying ? COLORS.gray : COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { handleReset(); }}>
                <Ionicons name="refresh-circle" size={55} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container3: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.containerbox,
    borderRadius: 20,
    height: windowHeight * 0.77,
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
    marginTop: 20,
    marginLeft: windowWidth * 0.1,
  },
  titleText: {
    marginTop:60,
    paddingLeft: windowWidth * 0.1,
    ...FONTS.h6,
    color: COLORS.white,
  },
  timerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 30,
    width: 110,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginTop: 40,
    paddingLeft:15,
  },
});

export default App;
