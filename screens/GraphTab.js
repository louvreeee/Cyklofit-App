import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Dimensions} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, YAxis, Grid } from 'react-native-svg-charts';
import { Circle, G } from 'react-native-svg';
import moment from 'moment';
import { COLORS, FONTS } from '../constants'; 
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const GraphTab = ({ navigation }) => {
  const [data, setData] = useState([[], [], [], [], [], []]);
  const [xAxisLabels, setXAxisLabels] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newData1 = [...data[0], Math.random() * 100];
      const newData2 = [...data[1], Math.random() * 100];
      const newData3 = [...data[2], Math.random() * 100];
      const newData4 = [...data[3], Math.random() * 100];
      const newData5 = [...data[4], Math.random() * 100];
      const newData6 = [...data[5], Math.random() * 100];      
      const newLabels = [...xAxisLabels, moment().format('HH:mm:ss')];

      setData([
        newData1.slice(-10),
        newData2.slice(-10),
        newData3.slice(-10),
        newData4.slice(-10),
        newData5.slice(-10),
        newData6.slice(-10),
      ]);
      setXAxisLabels(newLabels.slice(-10));
      setCount((prevCount) => prevCount + 1);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [data, xAxisLabels]);

  const colors = ['#07E092', '#FD5B71', '#936DFF'];

  const contentInset = { top: 20, bottom: 20 };
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

  const handleStopwatch = () => {
    setIsTimerRunning((prevValue) => !prevValue);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  const handleReset = () => {
    setTimer(0);
    setIsTimerRunning(false);
    setData([[], [], [], [], [], []]);
    setXAxisLabels([]);
  };
  return (

    <View contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={styles.scrollView}>
    <View style={styles.mContainer}>
      {/* <TouchableOpacity style={{ ...styles.backButton, marginTop: 20, marginLeft:-20, }} onPress={() => navigation.goBack()}>
  <Ionicons name="arrow-back-circle" size={55} color={COLORS.white} />
</TouchableOpacity>*/}

      <View style={styles.container1}>
      
        <YAxis
          data={data[0]}
          contentInset={contentInset}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          numberOfTicks={6}  // <-- Change this line
  formatLabel={(value) => `${value.toFixed(2)}`}
        />
        <LineChart
          style={styles.chart}
          data={[
            {
              data: data[0],
              svg: { stroke: colors[0] },
            },
            {
              data: data[1],
              svg: { stroke: colors[1] },
            },
            {
              data: data[2],
              svg: { stroke: colors[2] },
            },
          ]}
          contentInset={contentInset}
          yMin={0}
          yMax={100}
          numberOfTicks={10}
        >

{/* Muscle group indicators */}
<View style={styles.levelContainer}>
        <View style={styles.level}>
            <Text style={styles.musclegroupText}>
            <Ionicons name="square" size={12} color={"#07E092"}  />
              <Text style={styles.valueText}>
              {" "} Quads
              </Text>
            </Text>
          </View>
          <View style={styles.level}>
            <Text style={styles.musclegroupText}>
            <Ionicons name="square" size={12} color={"#FD5B71"} />
              <Text style={styles.valueText}>
              {" "}Hamstrings
              </Text>
            </Text>
          </View>
          <View style={styles.level}>
            <Text style={styles.musclegroupText}>
            <Ionicons name="square" size={12} color={"#936DFF"} />
              <Text style={styles.valueText}>
              {" "} Glutes
              </Text>
            </Text>
          
          </View>
        </View>



          <Grid
            svg={{
              stroke: 'white',
              strokeWidth: 0.25,
              opacity: 0.5,
            }}
          />
          {/* Additional customization with Decorator if needed */}
        </LineChart>
      </View>
      
      <View style={styles.container2}>
        <YAxis
          data={data[0]}
          contentInset={contentInset}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          numberOfTicks={6}
          formatLabel={(value) => `${value.toFixed(2)}`}
        />
        <LineChart
          style={styles.chart}
          data={[
            {
              data: data[3],
              svg: { stroke: colors[0] },
            },
            {
              data: data[4],
              svg: { stroke: colors[1] },
            },
            {
              data: data[5],
              svg: { stroke: colors[2] },
            },
          ]}
          contentInset={contentInset}
          yMin={0}
          yMax={100}
          numberOfTicks={10}
      
        >
       
   {/* Muscle group indicators */}
<View style={styles.levelContainer}>
        <View style={styles.level}>
            <Text style={styles.musclegroupText}>
            <Ionicons name="square" size={12} color={"#07E092"}  />
              <Text style={styles.valueText}>
              {" "} Quads
              </Text>
            </Text>
          </View>
          <View style={styles.level}>
            <Text style={styles.musclegroupText}>
            <Ionicons name="square" size={12} color={"#FD5B71"} />
              <Text style={styles.valueText}>
              {" "}Hamstrings
              </Text>
            </Text>
          </View>
          <View style={styles.level}>
            <Text style={styles.musclegroupText}>
            <Ionicons name="square" size={12} color={"#936DFF"} />
              <Text style={styles.valueText}>
              {" "} Glutes
              </Text>
            </Text>
          
          </View>
        </View>


        
          <Grid
            svg={{
              stroke: 'white',
              strokeWidth: 0.25,
              opacity: 0.5,
            }}
          />
          {/* Additional customization with Decorator if needed */}
        </LineChart>
      </View>

    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  mContainer: {
    padding: 20,
    marginTop: 0,
    backgroundColor: COLORS.background,
    flex:1,
  },
  container1: {
    flexDirection: 'row',
    paddingVertical: 5,
    marginTop:0,
    backgroundColor: COLORS.containerbox,
    borderRadius: 20, 
    width:'100%',
    height:130,
    marginBottom:15,
    padding:20,
  },
  container2: {
    flexDirection: 'row',
    width:'100%',
    height: 130,
    paddingVertical: 5,
    marginTop:0,
    backgroundColor: COLORS.containerbox,
    borderRadius: 20, 
    marginBottom:30,
    padding:20,
  },
  container3: {
   // height: 200,
    paddingVertical: 16,
    marginTop:-30,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    //width: windowWidth * .8,
  //  paddingLeft: 20,
 //   paddingRight: 20,
   // paddingTop: 20,
   // marginLeft: windowWidth * 0.1,
  },
  chart: {
    flex: 1,
    marginLeft: 5,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
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
     height:120,
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

export default GraphTab;
