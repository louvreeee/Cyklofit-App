import * as React from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, Dimensions, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import GraphTab from './GraphTab';
import MuscleGroup from './MuscleGroup';
import DataTimer from './DataTimer';
import { COLORS, FONTS, SIZES } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import axios from 'axios';

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const DataMonitor = ({ navigation }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Muscle Map' },
    { key: 'second', title: 'Graph' },
  ]);

  const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: COLORS.background, }}>
      <MuscleGroup />
    </View>
  );

  const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: COLORS.background,}}>
      <GraphTab />
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = (props) => (
    <TabBar
    {...props}
    activeColor={'white'}
    inactiveColor={'white'}
    style={{
      backgroundColor: COLORS.background,
      borderRadius: 10,
      height: 50,
    }}
    indicatorStyle={{
      backgroundColor: 'red',
      borderRadius: 10,
    }}
  />
);

  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isTimerRunning) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isTimerRunning]);

  const handleStop = () => {
    setIsTimerRunning(false);
  };

  const handlePause = () => {
    setIsTimerRunning(false);
  };

  const handlePlay = () => {
    setIsTimerRunning(true);
  };

  const handleReset = () => {
    setTimer(0);
    setIsTimerRunning(false);
     setData([[], [], [], [], [], []]);
  };




  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };


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
    if (isConnected) { // Only proceed if connected
      try {
        await axios.post('http://192.168.55.119:5000/set-state-1');
        setCurrentState(1);
      } catch (error) {
        console.error('Error setting state 1:', error);
      }
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

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ paddingTop: 35, flexDirection: "row", paddingLeft:15,}}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle" size={55} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={{ ...FONTS.h6, marginLeft: windowWidth * 0.13, fontWeight: "500", marginTop: 20, color: COLORS.white }}>
          Data Monitoring
        </Text>
      </View>

      <View style={{ flex: 2,}}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          style={{ flex: 1 }}
        />
      </View>
      
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background,  }}>
      <DataTimer />
    </ScrollView>

</View>
    
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
   // backgroundColor: COLORS.background,
   // alignItems: "center",
  //  justifyContent: "center",
    padding:20,
    width:windowWidth,
   // height: windowHeight * 0.8,
  },
  bodyContainer: {
    flexDirection: "row",
    flex:2,
    marginBottom:10,
    justifyContent: 'center',
    alignItems: 'center',
  width:windowWidth * 0.8,
    height: '40%',
  },
 background: { 
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#171725",
    paddingHorizontal: 20,
},
titleText: { 
    ...FONTS.h6, 
    textAlign: "left",
    color: COLORS.white,
    marginTop:20,
    marginLeft:70,
},
description: { 
    ...FONTS.h6, 
    textAlign: "left",
    color: COLORS.white,
},
btn: {
    width: SIZES.width - 44
},
bottomContainer: { 
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12
},
topview:{
  marginHorizontal:35,
  flex:1,
  justifyContent:"space-between",
},
welcomemessage:{
  color:COLORS.white,
  fontSize:35,
  ...FONTS.h5, 
},
timerContainer: {
  alignItems: "center",
  justifyContent: "center",
  marginTop: 20,
     // paddingTop: Constants.statusBarHeight,
     backgroundColor: COLORS.containerbox,
     borderRadius: 20, 
   //  padding: 20,
   width:'100%',
   height:180,
   flex: 1 
},
muscleIndex: {
  alignItems: "center",
  justifyContent: "center",
  marginTop: 20,
     // paddingTop: Constants.statusBarHeight,
     backgroundColor: COLORS.containerbox,
     borderRadius: 20, 
   //  padding: 20,
   width:'100%',
   height:windowHeight * 0.18,
},
timerText: {
  ...FONTS.h4,
  color: COLORS.white,
  marginBottom: 10,
},
labelText: {
  ...FONTS.body4,
  color: COLORS.gray,
  marginBottom: 10,
  alignItems: "center",
  justifyContent: "center",
},
startButton: {
  backgroundColor: COLORS.primary,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
},

startButtonText: {
  ...FONTS.body3,
  color: COLORS.white,
},

welcomecontainer:{
  flexDirection:"row",
  justifyContent:"space-between",
  alignItems:"center"
},
propertiesText: {
  marginTop: 20,
  fontSize: 21,
  fontWeight: "500",
  color: COLORS.white,
},
propertiesArea: {
  marginTop: 0,
  flexDirection: "row",
 // justifyContent: "flex-start",
  justifyContent:"space-between",
  alignItems:"center",
  width:"65%",
},
level: {
  marginRight: 25,
  marginLeft: 25,
  justifyContent:"space-between",
  alignItems:"center"
},
musclegroupText: {
  fontSize: 14,
  color: "#fff",
},
valueText: {
  fontSize: 12,
  color: "#E3E7EC",
},
});
export default DataMonitor;
