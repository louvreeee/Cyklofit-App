import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image,ScrollView, Alert, Text, TouchableOpacity, Dimensions } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts';
import { COLORS, FONTS } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import data from "../constants/training.json";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { getDatabase, set,ref, get,push, serverTimestamp } from 'firebase/database';
import { getFirebaseApp } from '../utils/firebaseHelper'
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const DataTimer = ({ route, navigation, ...props }) => {
  const { trainingId } = props;
  const training = data.trainings.find((element) => element.id === trainingId);
  const quadsHighImage = require('../assets/images/quads-high.png');
  const quadsLowImage = require('../assets/images/quads-low.png');
  const quadsMedImage = require('../assets/images/quads-med.png');
  const hamsLowImage = require('../assets/images/hams-low.png');
  const hamsMedImage = require('../assets/images/hams-med.png');
  const hamsHighImage = require('../assets/images/hams-high.png');
  const glutesHighImage = require('../assets/images/glutes-high.png');
  const glutesLowImage = require('../assets/images/glutes-low.png');
  const glutesMedImage = require('../assets/images/glutes-med.png');

  const getMuscleImage = (imageName) => {
    switch (imageName) {
      case "quads-high":
        return quadsHighImage;
      case "quads-med":
        return quadsMedImage;
      case "quads-low":
        return quadsLowImage;
      case "hams-low":
        return hamsLowImage;
      case "hams-med":
        return hamsMedImage;
      case "hams-high":
        return hamsHighImage;
      case "glutes-high":
        return glutesHighImage;
      case "glutes-med":
        return glutesMedImage;
      case "glutes-low":
        return glutesLowImage;
      default:
        return null;
    }
  };

  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [barData, setBarData] = useState(Array.from({ length: 6 }, () => [])); // Initialize with 3 empty arrays
  const colors = ['#07E092', '#FD5B71', '#936DFF','#07E092', '#FD5B71', '#936DFF'];
  const [stopButtonPressed, setStopButtonPressed] = useState(false);
  const [currentState, setCurrentState] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Not Connected');
  const [isConnected, setIsConnected] = useState(false); // Track connection status as a boolean
  const [isCalMode, setIsCalMode] = useState(false); // Track kung naka-on na si calibration
  

  const resetTimer = async () => {
    try {
      await axios.post('https://testdeploy-production-50d3.up.railway.app/reset-timer');
      setCurrentState('Timer Reset');
      // Optionally reset other states or variables as needed
    } catch (error) {
      console.error('Error resetting timer:', error);
    }
  };


  const setState1 = async () => {
    if (isConnected) { // Only proceed if connected
      try {
        await axios.post('https://testdeploy-production-50d3.up.railway.app/set-state-1');
        setCurrentState(1);
        setIsCalMode(true);
      } catch (error) {
        console.error('Error setting state 1:', error);
      }
    }
  };


  const setState2 = async () => {
    try {
      await axios.post('https://testdeploy-production-50d3.up.railway.app/set-state-2');
      setCurrentState(2);
    } catch (error) {
      console.error('Error setting state 2:', error);
    }
  };

  const setState3 = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://testdeploy-production-50d3.up.railway.app/set-state-3', { // Use your Flask server IP and port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainingType: trainingId, // Replace with your actual training ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send training type');
      }

      const result = await response.json();
      Alert.alert('Success', result.message);
    } catch (error) {
      Alert.alert('Error', error.toString());
    } finally {
      setIsLoading(false);
    }
  };


  const getState = async () => {
    try {
      const response = await axios.get('https://testdeploy-production-50d3.up.railway.app/get-state');
      setCurrentState(response.data.state);
    } catch (error) {
      console.error('Error getting state:', error);
    }
  };
  useEffect(() => {
    let intervalId;

    if (isTimerRunning) {
      intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isTimerRunning]);

{/*} useEffect(() => {
    const intervalId = setInterval(() => {
      const newBars = barData.map(bar => [...bar, Math.random() * 100].slice(-10));
      setBarData(newBars);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []); */}

  const handlePause = () => setIsTimerRunning(false);
  const handlePlay = () => setIsTimerRunning(true);


  const handleStop = async () => {
    setIsTimerRunning(false);
    setStopButtonPressed(true);
  
    try {
      const database = getDatabase(getFirebaseApp());
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userId = user.uid;
          const trainingNames = {
            1: "Sprinting",
            2: "Standing Climbing",
            3: "Seated Climbing"
          };
          const trainingName = trainingNames[trainingId];
          const trainingRef = ref(database, `users/${userId}/Training/${trainingName}/timers`);
  
          // Check if previous entry exists
          const snapshot = await get(trainingRef);
          let previousTotalTime = 0;
          if (snapshot.exists()) {
            const previousData = snapshot.val();
            previousTotalTime = previousData.totalTime || 0;
          }
  
          const timestamp = new Date().toLocaleString(); // Format the timestamp
          const totalTime = previousTotalTime + timer; // Add current timer to previous total time
  
          // Update database with the new total time
          await set(trainingRef, {
            totalTime: totalTime,
            timestamp: timestamp
          });
          console.log('Time added to the database successfully.');
        }
      });
    } catch (error) {
      console.error('Error adding time to the database:', error);
    }
  };
  

  const handleReset = () => {
    setTimer(0);
    setIsTimerRunning(false);
    setBarData(Array.from({ length: 6 }, () => [])); // Reset to 3 empty arrays
    setStopButtonPressed(false); // Reset stop button pressed state
  };


  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMuscleFatigueIndex = async () => {
      try {
        const database = getDatabase(getFirebaseApp());
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userId = user.uid;
            const trainingNames = {
              1: "Sprinting",
              2: "Standing Climbing",
              3: "Seated Climbing"
            };
            const trainingName = trainingNames[trainingId];
            const mfiRef = ref(database, `users/${userId}/Training/${trainingName}/muscleFatigueIndex`);
            const snapshot = await get(mfiRef);
  
            if (snapshot.exists()) {
              const data = snapshot.val();
              // Convert the muscle fatigue index data to an array of arrays
              const newBarData = Object.values(data).map(value => [value]); // Convert each value to an array
              setBarData(newBarData);
            }
          }
        });
      } catch (error) {
        console.error('Error fetching muscle fatigue index data:', error);
        Alert.alert('Error', 'Failed to fetch muscle fatigue index data');
      } finally {
        setIsLoading(false); // Set loading state to false after fetching data
      }
    };
  
    fetchMuscleFatigueIndex();
  }, [trainingId]); // Fetch data when trainingId changes
  
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingBottom: 30 }}>
      <ScrollView style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
      <View style={styles.goalContainer}>
          <View style={styles.barChartContainer}>
            <Text style={styles.labelText}>Predetermined Training Standard</Text>
             
            <View style={styles.musclegroup}>
  {training.muscleimages.map((imageName, index) => (
    <View key={`${imageName}-${index}`} style={styles.level}> 
      <View style={styles.imageContainer}>
        <Image source={getMuscleImage(imageName)} style={styles.iconImage} />
      </View>
    </View>
  ))}
</View>


            <View style={styles.propertiesArea}>
            <View style={styles.level}>
              <Text style={styles.musclegroupText}>
                Quads:</Text>
                <Text style={styles.valueText}>
                {training.musclegroups.quads}</Text>
            </View>
            <View style={styles.level}>
              <Text style={styles.musclegroupText}>
                Hamstrings:</Text>
                <Text style={styles.valueText}>
                {training.musclegroups.hamstrings}</Text>
              
            </View>
            <View style={styles.level}>
              <Text style={styles.musclegroupText}>
                Glutes:</Text>
                <Text style={styles.valueText}>
                {training.musclegroups.glutes}</Text>
          
            </View>
          </View>

        
          </View>
        </View>

        <View style={styles.timerContainer}>
          <View style={styles.barChartContainer}>
            <Text style={styles.labelText}>Muscle Fatigue Index</Text>
            <BarChart
  style={{ height: 150, width: 300 }}
  horizontal={true}
  spacingInner={0.1}
  gridMin={0}
  gridMax={1}
  data={barData.map((data, index) => ({
    data,
    svg: { fill: colors[index] },
  }))}
  contentInset={{ top: 10, bottom: 15 }}
>

  <Grid direction={Grid.Direction.VERTICAL} svg={{ stroke: 'white', strokeWidth: 0.25, opacity: 0.2 }}/>
  <Grid direction={Grid.Direction.VERTICAL} svg={{ stroke: 'red', strokeWidth: 0.25, opacity: 0.2 }}/>
</BarChart>

          </View>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.labelText}>Total Time</Text>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
            <TouchableOpacity onPress={handleStop}>
              <Ionicons name="stop-circle" size={55} color={COLORS.white} />
            </TouchableOpacity>
            {!stopButtonPressed && ( // Only render play button if stop button is not pressed
              isTimerRunning ? (
                <TouchableOpacity onPress={() => { handlePause(); setState2(); }}>
                  <Ionicons name="pause-circle" size={55} color={COLORS.gray} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => { handlePlay(); setState3(); }}>
                  <Ionicons name="play-circle" size={55} color={COLORS.gray} />
                </TouchableOpacity>
              )
            )}
            <TouchableOpacity onPress={() => { handleReset(); resetTimer();}}>
              <Ionicons name="refresh-circle" size={55} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: COLORS.containerbox,
    borderRadius: 20,
    width: '100%',
    height: 190,
    flex: 1
  },
  labelText: {
    ...FONTS.body4,
    color: COLORS.gray,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  timerText: {
    ...FONTS.h4,
    color: COLORS.white,
    marginBottom: 10,
  },
  goalContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: windowHeight * 0.022,
    backgroundColor: COLORS.containerbox,
    borderRadius: 20,
    width: '100%',
    height: 170,
  },

  barChartContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },

  propertiesArea: {
    width: windowWidth * 0.77,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", 
    alignSelf: "center", 
    textAlign: "center",
    paddingBottom:10,
    paddingHorizontal: windowWidth * 0.03,
  },
  musclegroup:
  {
      width: windowWidth * 0.6,
      flexDirection: "row",
      justifyContent: "space-between",
     paddingTop:10,
      paddingBottom:0,
  },
  level: { 
    width: windowWidth * 0.25,
    textAlign: 'center',
  },
  musclegroupText: {
    ...FONTS.body5,
    color: COLORS.white,
    alignItems: "center",
    textAlign: 'center',
    justifyContent: "center",
    color: "#696969",
  },
  imageContainer: {
    backgroundColor: "#20202B",
    borderRadius: wp('10%'),
    width: wp('14'),
    height: wp('14%'),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  iconImage: {
    width: '89%',
    height: '89%',
    resizeMode: 'contain',
    paddingLeft: wp('0%'),
  },
  valueText: {
    ...FONTS.body5,
    color: COLORS.white,
    alignItems: "center",
    textAlign: 'center',
    justifyContent: "center",
    color: "#E3E7EC",
  },
});

export default DataTimer;
