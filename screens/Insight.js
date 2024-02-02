import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { LineChart, YAxis, Grid, XAxis, BarChart } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import { Circle, G } from 'react-native-svg';
import CircularProgress from 'react-native-circular-progress-indicator';
import { COLORS, FONTS } from '../constants';

const Insight = () => {
  const [chartData] = useState([50, 10, 40, 95]);
  const barData = [14, 80, 100, 55, 20, 30];
  const barData2 = [10, 20, 60, 30, 5, 90];
 
  // Get current date 
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });



  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
      <View style={styles.circularProgress}>
         {/* Display current date */}
         <Text style={styles.currentDate}> {currentDate}</Text>
         </View>
        <View style={styles.circularProgress}>
          <Text style={styles.labelText}>Total Time</Text>
          <CircularProgress
            value={75}
            activeStrokeColor={'#f39c12'}
            inActiveStrokeColor={'#f39c12'}
            inActiveStrokeOpacity={0.2}
            progressValueColor={'#fff'}
            valueSuffix={'%'}
            textStyle={{ fontSize: 15 }}
            radius={40}
            strokeWidth={8}
          />
        </View>

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

        <View style={styles.lineChartContainer}>
          <Text style={styles.labelText}>Muscle Activity</Text>
          <View style={{ flexDirection: 'row', height: 200 }}>
            <YAxis
              data={chartData}
              contentInset={{ top: 20, bottom: 20 }}
              svg={{ fill: 'grey', fontSize: 10 }}
              numberOfTicks={10}
              formatLabel={(value) => `${value}`}
            />
            <LineChart
              style={{ flex: 1, marginLeft: 16 }}
              data={chartData}
              svg={{ stroke: 'rgb(134, 65, 244)' }}
              contentInset={{ top: 20, bottom: 20 }}
            >
              <Grid />
            </LineChart>
          </View>
        </View>

        <View style={styles.barChartContainer}>
          <Text style={styles.labelText}>Muscle Fatigue Index</Text>
          <BarChart
            style={{ height: 200 }}
            horizontal={true}
            spacingInner={0.1}
            gridMin={0}
            gridMax={100}
            data={barData2}
            svg={{ fill: 'lightblue' }}
            contentInset={{ top: 30, bottom: 30 }}
          >
            <Grid direction={Grid.Direction.VERTICAL} />
          </BarChart>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1,
  height: '100%',},
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    marginBottom:60,
  },
  currentDate: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: 10,
    textAlign: 'center',
  },
  circularProgress: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: COLORS.containerbox,
    borderRadius: 20,
    padding: 20,
  },
  chartContainer: {
    height: 200,
    //padding: 20,
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: COLORS.containerbox,
    borderRadius: 20,
  },
  lineChartContainer: {
    marginTop: 20,
    backgroundColor: COLORS.containerbox,
    borderRadius: 20,
    padding: 20,
  },
  barChartContainer: {
    marginTop: 20,
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
});

export default Insight;
