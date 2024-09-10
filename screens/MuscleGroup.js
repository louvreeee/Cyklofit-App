import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from 'react-native-circular-progress-indicator';
import Body from 'react-native-body-highlighter';
import { COLORS, FONTS, SIZES } from '../constants';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const MuscleGroup = ({id}) => {
  const [bodyPartSelected, setBodyPartSelected] = useState({ slug: '', intensity: 2 });
  const [data, setData] = useState({
    L_glutes: { high: [], medium: [], low: [] },
    L_hams: { high: [], medium: [], low: [] },
    L_quads: { high: [], medium: [], low: [] },
    R_glutes: { high: [], medium: [], low: [] },
    R_hams: { high: [], medium: [], low: [] },
    R_quads: { high: [], medium: [], low: [] }
  });
  const [randomValue, setRandomValue] = useState(0);

  // Fetch data from Firebase kineme
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userId = user.uid;
            const muscleGroups = ['L_glutes', 'L_hams', 'L_quads', 'R_glutes', 'R_hams', 'R_quads'];
            const trainingNames = {
              1: "Sprinting",
              2: "Standing Climbing",
              3: "Seated Climbing"
            };
            const trainingName = trainingNames[id];

            muscleGroups.forEach(muscle => {
  const userProgressDataRef = ref(getDatabase(), `users/${userId}/Calibration/Training/${trainingName}/Thresholds/${muscle}`);

  onValue(userProgressDataRef, (snapshot) => {
    const userProgressData = snapshot.val();
    if (userProgressData) {
      console.log(`Real-time Circular Progress Data for ${id} ${trainingName} ${muscle}:`, userProgressData);
      setData(prevData => ({
        ...prevData,
        [muscle]: userProgressData
      }));
    } else {
      console.log(`No data available for ${id} ${trainingName} ${muscle}`);
    }
  });
});

          }
        });
      } catch (error) {
        console.error('Fetch Progress Data Error:', error);
      }
    };

    fetchProgressData();
  }, [id]);
 useEffect(() => {
    const randomBodyPart = () => {
      const bodyParts = ['hamstring', 'quadriceps', 'gluteal'];
      const randomIndex = Math.floor(Math.random() * bodyParts.length);
      return bodyParts[randomIndex];
    };

    const intervalId = setInterval(() => {
      setBodyPartSelected({ slug: randomBodyPart(), intensity: 2 });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);


// Calculate the maximum value from the high threshold of each muscle group
const getMaxValues = () => {
  const maxValues = {};

  Object.keys(data).forEach(muscleGroup => {
    const highThreshold = data[muscleGroup]?.high;

    if (Array.isArray(highThreshold) && highThreshold.length >= 2) {
      const maxValue = Math.max(...highThreshold);
      maxValues[muscleGroup] = maxValue;
    }
  });

  return maxValues;
};

// Get the maximum values
const maxValues = getMaxValues();

  // Update randomValue at regular intervals
  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomValue = getRandomValue();
      setRandomValue(randomValue);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Generate a random value
  const getRandomValue = () => Math.floor(Math.random() * 600);

 // color changes based on value and threshold ranges
const getColor = (value, thresholds) => {
  if (value >= thresholds.high[0] && value <= thresholds.high[1]) {
    return '#2ecc71'; // High range color
  } else if (value > thresholds.high[1]) {
    return '#2f5585'; // High range color when value exceeds high threshold
  } else if (value >= thresholds.medium[0] && value <= thresholds.medium[1]) {
    return '#f39c12'; // Medium range color
  } else if (value >= thresholds.low[0] && value <= thresholds.low[1]) {
    return '#C80C0C'; // Low range color
  } else {
    return '#3f3f3f'; // Not activated
  }
};

  return (
    <View style={styles.container}>
      {/* Muscle group indicators eme */}
      <View style={styles.levelContainer}>
      <View style={styles.level}>
          <Text style={styles.musclegroupText}>
            <Ionicons name="square" size={12} color={"#3f3f3f"} />
            <Text style={styles.valueText}> Not Activated </Text>
          </Text>
        </View>
        <View style={styles.level}>
          <Text style={styles.musclegroupText}>
            <Ionicons name="square" size={12} color={"#C80C0C"} />
            <Text style={styles.valueText}> Low </Text>
          </Text>
        </View>
        <View style={styles.level}>
          <Text style={styles.musclegroupText}>
            <Ionicons name="square" size={12} color={"#f39c12"} />
            <Text style={styles.valueText}> Medium </Text>
          </Text>
        </View>
        <View style={styles.level}>
          <Text style={styles.musclegroupText}>
            <Ionicons name="square" size={12} color={"#2ecc71"} />
            <Text style={styles.valueText}> High </Text>
          </Text>
        </View>
      </View>



      <View style={styles.mcontainer}>
    
        {/* Circular progress indicators */}
        <View style={styles.progressContainer}>
        <CircularProgress
        //value={(randomValue / maxValues['lglutes']) * 100} // Calculate percentage relative to max value
        value={randomValue}
        activeStrokeColor={getColor(randomValue, data['L_glutes'])}
        inActiveStrokeOpacity={0.2}
        progressValueColor={'#fff'}
        textStyle={{ fontSize: 15 }}
        radius={windowWidth * 0.058}
        strokeWidth={8}
        //valueSuffix={'%'}
      />
          
          
          
          <View style={{marginBottom: windowHeight * 0.08 }}></View>

          
          <CircularProgress
          //value={(randomValue / maxValues['lhams']) * 100}
          value={randomValue}
          activeStrokeColor={getColor(randomValue, data['L_hams'])} // Pass the thresholds for lglutes
          inActiveStrokeOpacity={0.2}
          progressValueColor={'#fff'}
          textStyle={{ fontSize: 15 }}
          radius={windowWidth * 0.058}
          strokeWidth={8}
          //valueSuffix={'%'}
        />

<View style={{ marginBottom: windowHeight * 0.08  }}></View>
<CircularProgress
          //value={(randomValue / maxValues['lquads']) * 100}
          value={randomValue}
          activeStrokeColor={getColor(randomValue, data['L_quads'])} // Pass the thresholds for lglutes
          inActiveStrokeOpacity={0.2}
          progressValueColor={'#fff'}
          textStyle={{ fontSize: 15 }}
          radius={windowWidth * 0.058}
          strokeWidth={8}
          //valueSuffix={'%'}
        />
      
        </View>

        {/* Body highlighter components */}
        <View style={styles.bodyHighlightContainer}>
        <Body
            data={[bodyPartSelected]}
            //onBodyPartPress={(e) => setBodyPartSelected({ slug: e.slug, intensity: 2 })}
            gender="male"
            side="front"
            scale={0.6}
            style={{ stroke: 'none' }}
            strokeWidth={0}
          />
          <Body
            data={[bodyPartSelected]}
           // onBodyPartPress={(e) => setBodyPartSelected({ slug: e.slug, intensity: 2 })}
            gender="male"
            side="back"
            scale={0.6}
            style={{ stroke: 'none' }}
            strokeWidth={0}
          />

        </View>



        <View style={styles.progressContainer}>
        <CircularProgress
          //value={(randomValue / maxValues['rglutes']) * 100}
          value={randomValue}
          activeStrokeColor={getColor(randomValue, data['R_glutes'])} // Pass the thresholds for lglutes
          inActiveStrokeOpacity={0.2}
          progressValueColor={'#fff'}
          textStyle={{ fontSize: 15 }}
          radius={windowWidth * 0.058}
          strokeWidth={8}
          //valueSuffix={'%'}
        />

<View style={{ marginBottom: windowHeight * 0.08  }}></View>
<CircularProgress
          //value={(randomValue / maxValues['rhams']) * 100}
          value={randomValue}
          activeStrokeColor={getColor(randomValue, data['R_hams'])} // Pass the thresholds for lglutes
          inActiveStrokeOpacity={0.2}
          progressValueColor={'#fff'}
          textStyle={{ fontSize: 15 }}
          radius={windowWidth * 0.058}
          strokeWidth={8}
          //valueSuffix={'%'}
        />

<View style={{ marginBottom: windowHeight * 0.08 }}></View>
<CircularProgress
          //value={(randomValue / maxValues['rquads']) * 100}
          value={randomValue}
          activeStrokeColor={getColor(randomValue, data['R_quads'])} // Pass the thresholds for lglutes
          inActiveStrokeOpacity={0.2}
          progressValueColor={'#fff'}
          textStyle={{ fontSize: 15 }}
          radius={windowWidth * 0.058}
          strokeWidth={8}
          //valueSuffix={'%'}
        />
        </View>
      </View>




    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: windowWidth * .9,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    marginLeft: windowWidth * 0.045,
  },
  mcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    width: windowWidth,
    height: windowHeight * 0.45,
  },
  progressContainer: {
    width: windowWidth * 0.25,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 0,
    height: windowHeight * 0.25,
  },
  bodyHighlightContainer: {
    width: windowWidth * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
   // marginBottom: 20,
    flexDirection: 'row',
  },

  valueText: {
    ...FONTS.body6, 
    fontSize: 12,
    color: "#E3E7EC",
  },
});

export default MuscleGroup;
