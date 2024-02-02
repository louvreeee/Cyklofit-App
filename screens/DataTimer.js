import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts';
import { COLORS, FONTS } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';

const DataTimer = ({ navigation }) => {
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [barData, setBarData] = useState(Array.from({ length: 6 }, () => [])); // Initialize with 3 empty arrays
  const colors = ['#07E092', '#FD5B71', '#936DFF','#07E092', '#FD5B71', '#936DFF'];

  useEffect(() => {
    let intervalId;

    if (isTimerRunning) {
      intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isTimerRunning]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newBars = barData.map(bar => [...bar, Math.random() * 100].slice(-10));
      setBarData(newBars);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const handlePause = () => setIsTimerRunning(false);
  const handlePlay = () => setIsTimerRunning(true);
  const handleReset = () => {
    setTimer(0);
    setIsTimerRunning(false);
    setBarData(Array.from({ length: 6 }, () => [])); // Reset to 3 empty arrays
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingBottom: 30 }}>
      <ScrollView style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
        <View style={styles.timerContainer}>
          <View style={styles.barChartContainer}>
            <Text style={styles.labelText}>Muscle Fatigue Index</Text>
            <BarChart
              style={{ height: 150, width: 300 }}
              horizontal={true}
              spacingInner={0.1}
              gridMin={0}
              gridMax={100}
              data={barData.map((data, index) => ({
                data,
                svg: { fill: colors[index] },
              }))}
              contentInset={{ top: 30, bottom: 30 }}
            >
              <Grid direction={Grid.Direction.VERTICAL} />
            </BarChart>
          </View>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.labelText}>Total Time</Text>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
            <TouchableOpacity onPress={handlePause}>
              <Ionicons name="pause-circle" size={55} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePlay}>
              <Ionicons name="play-circle" size={55} color={COLORS.gray} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReset}>
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
    height: 180,
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
  barChartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DataTimer;
