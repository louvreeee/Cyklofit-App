import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { LineChart, YAxis, Grid, XAxis, BarChart, PieChart  } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import { Circle, G } from 'react-native-svg';
import CircularProgress from 'react-native-circular-progress-indicator';
import { COLORS, FONTS } from '../constants';
import { Ionicons } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import moment from 'moment';

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const Insight = () => {
  //const [chartData] = useState([50, 10, 40, 95]);
  const barData = [14, 80, 100, 55, 20, 30];
  const barData2 = [10, 20, 60, 30, 5, 90];

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [data, setData] = useState([
    [], // Initial state as arrays instead of objects with a data key
    [],
    [],
    [],
    [],
    [],
  ]);
  const [xAxisLabels, setXAxisLabels] = useState([]);

  useEffect(() => {
    const fetchGraphData = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userId = user.uid;
          const paths = ['lhams', 'lglutes']; 
          paths.forEach((path, index) => {
            const userGraphDataRef = ref(getDatabase(), `users/${userId}/Signal/linegraph/${path}`);
            onValue(userGraphDataRef, (snapshot) => {
              const userGraphData = snapshot.val();
              if (userGraphData) {
                setData((prevData) => prevData.map((d, i) => i === index ? userGraphData.mv : d));
                if (index === 0) { 
                  setXAxisLabels(userGraphData.seconds.map((second) => moment.unix(second).format('HH:mm:ss')));
                }
              }
            });
          });
        }
      });
    };

    fetchGraphData();
  }, []);

  const [totalTrainingTime, setTotalTrainingTime] = useState(0);
  const [pieChartData, setPieChartData] = useState([]);
  const getColorForTrainingName = (trainingName) => {
    switch (trainingName) {
      case 'Sprinting':
        return '#07E092';
      case 'Standing Climbing':
        return '#FD5B71';
      case 'Seated Climbing':
        return '#936DFF';
      default:
        return '#3f3f3f'; // Default color if trainingName does not match
    }
  };
  
  const colors = ['#07E092', '#FD5B71', '#936DFF'];
  useEffect(() => {
    const fetchTrainingData = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userId = user.uid;
          const trainingNames = {
            "Sprinting": 1,
            "Standing Climbing": 2,
            "Seated Climbing": 3
          };

          let totalTime = 0;
          const updatedPieData = [];

          for (const trainingName in trainingNames) {
            const trainingRef = ref(getDatabase(), `users/${userId}/Training/${trainingName}/timers/totalTime`);

            // Fetch the total time for the current training type
            onValue(trainingRef, (snapshot) => {
              const time = snapshot.val();
              if (time) {
                totalTime += time;
                updatedPieData.push({
                  key: trainingNames[trainingName],
                  value: time,
                  svg: { fill: colors[updatedPieData.length] },
                  trainingName: trainingName,
                });
                // Update the pie chart data state uwu
                setPieChartData([...updatedPieData]);
                setTotalTrainingTime(totalTime);
              } else {
                console.log(`No total time found for training: ${trainingName}`);
              }
            });
          }
        }
      });
    };

    fetchTrainingData();
  }, []);



  const [muscleFatigueIndexData, setMuscleFatigueIndexData] = useState([]);

  useEffect(() => {
    const fetchMuscleFatigueIndexData = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userId = user.uid;
          const trainingName = "Seated Climbing";

          const mfiRef = ref(
            getDatabase(),
            `users/${userId}/Training/${trainingName}/muscleFatigueIndex`
          );

          onValue(mfiRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              // Convert the object to an array of objects
              const mfiArray = Object.entries(data).map(([muscle, fatigue]) => {
                return { muscle, fatigue };
              });
              setMuscleFatigueIndexData(mfiArray);
            }
          });
        }
      });
    };

    fetchMuscleFatigueIndexData();
  }, []);

  const renderBarChart = () => {
    return (
      <View style={styles.barChartContainer}>
        <BarChart
          style={{ height: 200 }}
          horizontal={true}
          data={muscleFatigueIndexData.map(item => item.fatigue)}
          svg={{ fill: 'salmon' }}
          contentInset={{ top: 30, bottom: 30 }}
        >
         <Labels />
          <Grid direction={Grid.Direction.VERTICAL} svg={{ stroke: 'white', strokeWidth: 0.25, opacity: 0.2 }} />
        </BarChart>
      </View>
    );
  };

  const Labels = () => {
    const muscleGroups = ["quads", "hams",  "glutes"];
    const colors = {
      "quads": "#07E092",
      "hams": "#FD5B71",
      "glutes": "#936DFF",
    };
  
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10,  }}>
        {muscleGroups.map((muscle, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 12, height: 12, backgroundColor: colors[muscle], marginRight: 5}} />
            <Text style={{ color: 'white', fontSize: 12 }}>{muscle}</Text>
          </View>
        ))}
      </View>
    );
  };
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
      <View style={styles.topSection}>
        
         <Text style={styles.currentDate}>Analytics as of <Ionicons name="calendar" size={windowHeight * 0.017} color={COLORS.white} /> {currentDate}</Text>
         </View>
         <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Total Time</Text>
        </View>
        <View style={styles.pieAndLabelsContainer}>
  <View style={styles.pieContainer}>
    <PieChart
      style={{ height: 180 }}
      data={pieChartData}
      innerRadius="50%"
      outerRadius="80%"
      labelRadius={100}
      padAngle={0.04}
    >
   <Text style={styles.labelTest}>{totalTrainingTime}s</Text>
    </PieChart>
  </View>
  <View style={styles.labelsContainer}>
  {pieChartData.map((item, index) => (
    <TouchableOpacity key={index} onPress={() => console.log(`${item.trainingName}: ${item.value} seconds`)}>
      <Text style={styles.labelLegend}>
        <Ionicons name="square" size={12} color={getColorForTrainingName(item.trainingName)} /> {item.trainingName}: {item.value}s
      </Text>
    </TouchableOpacity>
  ))}
</View>


</View>

       

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Muscle Kineme</Text>
        </View>
        <View style={styles.muscleIndex}>
      <View style={styles.propertiesArea}>
          <View style={styles.level}>
            <Text style={styles.musclegroupText}>
              L-Q:
              <Text style={styles.valueText}>
                {" "} data%
              </Text>
            </Text>
            <Text style={styles.musclegroupText}>
              L-H:
              <Text style={styles.valueText}>
                {" "} data%
              </Text>
            </Text>
            <Text style={styles.musclegroupText}>
              L-G: 
              <Text style={styles.valueText}>
                {" "} data%
              </Text>
            </Text>
          </View>
          <View style={styles.level}>
            <Text style={styles.musclegroupText}>
             R-Q:
              <Text style={styles.valueText}>
                {" "} data%
              </Text>
            </Text>
            <Text style={styles.musclegroupText}>
             R-H:
              <Text style={styles.valueText}>
                {" "} data%
              </Text>
            </Text>
            <Text style={styles.musclegroupText}>
             R-G:
              <Text style={styles.valueText}>
                {" "} data%
              </Text>
            </Text>
          </View>
        </View>
  </View>


       
        <View style={styles.headerContainer}><Text style={styles.headerText}>Muscle Distribution</Text></View>
        <View style={styles.chartContainer}>
          <BarChart
            style={{height: 150, flex: 1,padding:20 }}
            data={barData}
            gridMin={0}
            svg={{ fill: 'rgb(134, 65, 244)' }}
          />
          {/*<XAxis
            style={{ marginTop: 10 }}
            data={barData}
            scale={scale.scaleBand}
            formatLabel={(value, index) => index}
            labelStyle={{ color: 'black' }}
          />*/}
        </View>
        <View style={styles.headerContainer}><Text style={styles.headerText}>Muscle Activity</Text></View>
        <View style={styles.lineChartContainer}>
          <View style={{ flexDirection: 'row', height: 200 }}>
            <YAxis
              data={data[0]}
              contentInset={{ top: 20, bottom: 20 }}
              svg={{ fill: 'grey', fontSize: 10 }}
              numberOfTicks={10}
              formatLabel={(value) => `${value}`}
            />
            <LineChart
              style={{ flex: 1, marginLeft: 16 }}
              data={data.slice(0, 3).map((d, i) => ({ data: d, svg: { stroke: colors[i] } }))}
              contentInset={{ top: 20, bottom: 20 }}
            >
              <Grid svg={{ stroke: 'white', strokeWidth: 0.25, opacity:  0.2 }} />
            </LineChart>
          </View>
        </View>
        <View style={styles.headerContainer}><Text style={styles.headerText}>Muscle Fatigue Index</Text></View>
        <View style={styles.barChartContainer}>
         
        {renderBarChart()}
       
        </View>
      </View>
    </ScrollView>
  );
};

const Labels = () => {
  const muscleGroups = ["quads", "hams",  "glutes"];
  const colors = {
    "quads": "#07E092",
    "hams": "#FD5B71",
    "glutes": "#936DFF",
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10,  }}>
      {muscleGroups.map((muscle, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 12, height: 12, backgroundColor: colors[muscle], marginRight: 5}} />
          <Text style={{ color: 'white', fontSize: 12 }}>{muscle}</Text>
        </View>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  scrollView: { 
    flex: 1,
    height: '100%',
    backgroundColor: COLORS.background,
  },
  labelTest: {
   position: "absolute",
   marginTop:windowHeight *0.125,
    textAlign: "center",
    ...FONTS.h6,
    color: COLORS.white,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    marginBottom:70,
  },
  currentDate: {
    ...FONTS.body3,
    color: COLORS.white,
    marginBottom: 10,
    fontSize:windowHeight * 0.02,
    textAlign: 'right',
  },
  circularProgress: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: COLORS.containerbox,
    borderRadius: 20,
    padding: 20,
  },
  topSection:{
    paddingTop:20,
   },
  headerContainer:{
   paddingTop:20,
  },
  headerText: {
    marginTop:0,
    ...FONTS.body2,
    color: COLORS.white,
    fontSize: windowHeight * 0.022,
  },
  pieAndLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    backgroundColor: COLORS.containerbox,
    borderRadius: 20,
  },
  pieContainer: {
    height: 180,
    flex: 1,
    paddingLeft:windowWidth * 0.06,
  },
  labelsContainer: {
    flex: 1,
    borderRadius: 20,
    padding: 10,
    alignContent: 'center',
    justifyContent: 'center',
    height: 180,
  },
  labelLegend: {
    ...FONTS.body4,
    color: COLORS.white,
    textAlign: 'left',
  },
  chartContainer: {
    height: 200,
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: COLORS.containerbox,
    borderRadius: 20,
  },
  lineChartContainer: {
    marginTop: 10,
    backgroundColor: COLORS.containerbox,
    borderRadius: 20,
    padding: 20,
  },
  barChartContainer: {
    marginTop: 10,
    backgroundColor: COLORS.containerbox,
    borderRadius: 20,
    padding: 20,
  },
  labelText: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: 10,
    textAlign: 'center',
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

export default Insight;
