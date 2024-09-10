import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import { LineChart, YAxis, Grid } from 'react-native-svg-charts';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Ionicons } from "@expo/vector-icons";
import moment from 'moment';
import { COLORS, FONTS } from '../constants'; 

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const GraphTab = ({ navigation }) => {
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
          const paths = ['lhams', 'lglutes']; // Simplify data fetching logic
          paths.forEach((path, index) => {
            const userGraphDataRef = ref(getDatabase(), `users/${userId}/Signal/linegraph/${path}`);
            onValue(userGraphDataRef, (snapshot) => {
              const userGraphData = snapshot.val();
              if (userGraphData) {
                setData((prevData) => prevData.map((d, i) => i === index ? userGraphData.mv : d));
                if (index === 0) { // Only need to set labels once
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


  const colors = ['#07E092', '#FD5B71', '#936DFF'];
  const contentInset = { top: 20, bottom: 20 };


  return (
    <View style={styles.scrollView}>
      <View style={styles.mContainer}>
        <View style={styles.container1}>
         
          <YAxis
            data={data[0]}
            contentInset={contentInset}
            svg={{ fill: 'grey', fontSize: 10 }}
            numberOfTicks={10}
            formatLabel={(value) => `${value.toFixed(2)}`}
          />
          <LineChart
            style={styles.chart}
            data={data.slice(0, 3).map((d, i) => ({ data: d, svg: { stroke: colors[i] } }))}
            contentInset={contentInset}
            yMin={-12}
            yMax={12}
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

             <Grid svg={{ stroke: 'white', strokeWidth: 0.25, opacity: 0.5 }} />

          </LineChart>
        </View>
        
      <View style={styles.container2}>
          {/* Corrected data prop for YAxis, ensuring it receives an array */}
          {data[3] && (
            <YAxis
              data={data[3]}
              contentInset={contentInset}
              svg={{ fill: 'grey', fontSize: 10 }}
              numberOfTicks={6}
              formatLabel={(value) => `${value.toFixed(2)}`}
            />
          )}
          <LineChart
            style={styles.chart}
            data={data.slice(3, 6).map((d, i) => ({ data: d, svg: { stroke: colors[i % colors.length] } }))}
            contentInset={contentInset}
            yMin={0}
            yMax={100}
            numberOfTicks={10}
          >
           


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
              svg={{ stroke: 'white', strokeWidth: 0.25, opacity: 0.5 }}
            />
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
  chart: {
    flex: 1,
    marginLeft: 5,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
