import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from 'react-native-circular-progress-indicator';
import Body from 'react-native-body-highlighter';
import { COLORS, FONTS, SIZES } from '../constants';


const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const MuscleGroup = () => {
  const [bodyPartSelected, setBodyPartSelected] = useState({ slug: '', intensity: 2 });
  const [isBackSideEnabled, setIsBackSideEnabled] = useState(false);


  useEffect(() => {
    const intervalId = setInterval(() => {
      const bodyParts = ['hamstring', 'quadriceps', 'gluteal'];
      const randomIndex = Math.floor(Math.random() * bodyParts.length);
      setBodyPartSelected({ slug: bodyParts[randomIndex], intensity: 2 });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);


  const getRandomValue = () => Math.floor(Math.random() * 100);

  return (
    <View contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', }} style={styles.scrollView}>
      
        
  {/* Muscle group indicators */}
  <View style={styles.levelContainer}>
        <View style={styles.level}>
            <Text style={styles.musclegroupText}>
            <Ionicons name="square" size={12} color={"#C80C0C"} />
              <Text style={styles.valueText}>
              {" "} Low
              </Text>
            </Text>
          </View>
          <View style={styles.level}>
            <Text style={styles.musclegroupText}>
            <Ionicons name="square" size={12} color={"#f39c12"} />
              <Text style={styles.valueText}>
              {" "}Medium
              </Text>
            </Text>
          </View>
          <View style={styles.level}>
            <Text style={styles.musclegroupText}>
            <Ionicons name="square" size={12} color={"#2ecc71"} />
              <Text style={styles.valueText}>
              {" "} High
              </Text>
            </Text>
          
          </View>
        </View>


      <View style={styles.mcontainer}>
    
        {/* Circular progress indicators */}
        <View style={styles.progressContainer}>
          <CircularProgress
            value={getRandomValue()}
            inActiveStrokeColor={'#2ecc71'}
            inActiveStrokeOpacity={0.2}
            progressValueColor={'#fff'}
            valueSuffix={'%'}
            textStyle={{ fontSize: 15 }}
            radius={windowWidth * 0.058} 
            strokeWidth={8}
          /><View style={{marginBottom: windowHeight * 0.08 }}></View>
          <CircularProgress
        value={getRandomValue()}
        activeStrokeColor={'#f39c12'}
        inActiveStrokeColor={'#f39c12'}
        inActiveStrokeOpacity={0.2}
        progressValueColor={'#fff'}
        valueSuffix={'%'}
        textStyle={{ fontSize: 15 }}
        radius={windowWidth * 0.058} // Adjust the radius as needed
        strokeWidth={8} // Adjust the strokeWidth as needed
      /><View style={{ marginBottom: windowHeight * 0.08  }}></View>
        <CircularProgress
        value={getRandomValue()}
        activeStrokeColor={'#f39c12'}
        inActiveStrokeColor={'#f39c12'}
        inActiveStrokeOpacity={0.2}
        progressValueColor={'#fff'}
        valueSuffix={'%'}
        textStyle={{ fontSize: 15 }}
        radius={windowWidth * 0.058} // Adjust the radius as needed
        strokeWidth={8} // Adjust the strokeWidth as needed
      />
      
        </View>

        {/* Body highlighter components */}
        <View style={styles.bodyHighlightContainer}>
        <Body
        data={[bodyPartSelected]}
        onBodyPartPress={(e) =>
          setBodyPartSelected({ slug: e.slug, intensity: 2 })
        }
        gender="male"
        side="front"
        scale={0.6}
        style={{ strokeWidth: 0 }}
      />
        
        <Body
          data={[bodyPartSelected]}
          onBodyPartPress={(e) =>
            setBodyPartSelected({ slug: e.slug, intensity: 2 })
          }
          gender="male"
          side="back"
          scale={0.6}
          style={{ strokeWidth: 0 }}
        />
       
        </View>
        <View style={styles.progressContainer}>
        <CircularProgress
  value={getRandomValue()}
  inActiveStrokeColor={'#2ecc71'}
  inActiveStrokeOpacity={0.2}
  progressValueColor={'#fff'}
  valueSuffix={'%'}
  textStyle={{ fontSize: 15 }}
  radius={windowWidth * 0.058} // Adjust the radius as needed
  strokeWidth={8} // Adjust the strokeWidth as needed
/><View style={{ marginBottom: windowHeight * 0.08  }}></View>
<CircularProgress
  value={getRandomValue()}
  activeStrokeColor={'#f39c12'}
  inActiveStrokeColor={'#f39c12'}
  inActiveStrokeOpacity={0.2}
  progressValueColor={'#fff'}
  valueSuffix={'%'}
  textStyle={{ fontSize: 15 }}
  radius={windowWidth * 0.058} // Adjust the radius as needed
  strokeWidth={8} // Adjust the strokeWidth as needed
/><View style={{ marginBottom: windowHeight * 0.08 }}></View>
<CircularProgress
  value={getRandomValue()}
  activeStrokeColor={'#f39c12'}
  inActiveStrokeColor={'#f39c12'}
  inActiveStrokeOpacity={0.2}
  progressValueColor={'#fff'}
  valueSuffix={'%'}
  textStyle={{ fontSize: 15 }}
  radius={windowWidth * 0.058} // Adjust the radius as needed
  strokeWidth={8} // Adjust the strokeWidth as needed
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
    width: windowWidth * .8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    marginLeft: windowWidth * 0.1,
  },
  mcontainer: {
    //flexGrow: 1,
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
