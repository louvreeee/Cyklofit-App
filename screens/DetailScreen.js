import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ScrollView,
  Dimensions
} from "react-native";
import Button from '../components/Button'
import { Ionicons } from "@expo/vector-icons";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { cyclistTrainingData } from '../constants/data';
import { COLORS, FONTS, SIZES, icons } from "../constants";
import data from "../constants/training.json";


const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const image_v_1 = require("../assets/images/training1.jpg");
const image_v_2 = require("../assets/images/training2.jpg");
const image_v_3 = require("../assets/images/training3.jpg");
const quadsHighImage = require('../assets/images/quads-high.png');
const hamsLowImage = require('../assets/images/hams-low.png');
const hamsMedImage = require('../assets/images/hams-med.png');
const glutesHighImage = require('../assets/images/glutes-high.png');

const DetailScreen = ({ route, navigation }) => {
  const training = data.trainings.find(
    (element) => element.id === route.params.id
  ); 
  const getImage = (id) => {
    if (id == 1) return image_v_1;
    if (id == 2) return image_v_2;
    if (id == 3) return image_v_3;
  };
  const getMuscleImage = (imageName) => {
    switch (imageName) {
      case "quads-high":
        return quadsHighImage;
      case "hams-low":
        return hamsLowImage;
      case "hams-med":
        return hamsMedImage;
      case "glutes-high":
        return glutesHighImage;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.headerSection, { backgroundColor: "rgba(0, 0, 0, 1)" }]}>
          <ImageBackground source={getImage(training.id)} style={styles.trainingImage} />
          <TouchableOpacity style={styles.backButton} onPress={()=> navigation.goBack()}>
            <Ionicons name="arrow-back-circle" size={55} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{flex:1,}}>
        <View style={styles.listSection}>
          <Text style={styles.subHeader}>TRAINING DETAIL</Text>
          <View style={styles.headSection}>
            <View style={styles.topTextArea}>
              <Text style={styles.makemodelText}>{training.make}</Text>
            </View>
          </View>
          <Text style={styles.descriptionText}>{training.description}</Text>
          <Text style={styles.propertiesText}>Muscle Activation Level</Text>
          <View style={styles.propertiesArea}>
            <View style={styles.level}>
              <Text style={styles.musclegroupText}>
                Quads:
                <Text style={styles.valueText}> {training.musclegroups.quads}</Text>
              </Text>
            </View>
            <View style={styles.level}>
              <Text style={styles.musclegroupText}>
                Hamstrings:
                <Text style={styles.valueText}> {training.musclegroups.hamstrings}</Text>
              </Text>
            </View>
            <View style={styles.level}>
              <Text style={styles.musclegroupText}>
                Glutes:
                <Text style={styles.valueText}> {training.musclegroups.glutes}</Text>
              </Text>
            </View>
          </View>



          
              
              <View style={styles.musclegroup}>
              {training.muscleimages.map((imageName, index) => (
                <View key={index} style={styles.level}>
                  <View style={styles.imageContainer}>
                    <Image source={getMuscleImage(imageName)} style={styles.iconImage} />
                  </View>
                </View>
              ))}
            </View>
        
          
      
          <TouchableOpacity style={styles.startButton}>
            <Button
              title="Start"
              style={styles.buttonStyle}
              onPress={() => navigation.navigate('DataMonitor')}
            />
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  headerSection: {
    position: 'relative',
    height: hp('35%'),
    width: '140%',
  },
  trainingImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    marginTop: 40,
    paddingLeft:15,
  },
  listSection: {
    flex: 1,
    paddingRight: 30,
    paddingLeft: 30,
    paddingBottom: 30,
    paddingTop: 20,
  },
  subHeader: {
    ...FONTS.body4,
    fontWeight: "700",
    color: COLORS.gray,
    letterSpacing: 5,
    marginBottom: wp('4%'),
    paddingTop:10,
  },
  headSection: {},
  topTextArea: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  makemodelText: {
    fontSize: wp('5%'),
    fontWeight: "500",
    color: COLORS.white,
  },
  descriptionText: {
    marginTop: wp('2%'),
    ...FONTS.body3,
    lineHeight: wp('6%'),
    color: COLORS.white,
  },
  propertiesText: {
    marginTop: wp('4%'),
    fontSize: wp('4.5%'),
    fontWeight: "500",
    color: COLORS.white,
  },
  propertiesArea: {
    marginTop: wp('4%'),
    width: wp('85%'),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  musclegroup:
  {
      marginTop: wp('4%'),
      width: wp('85%'),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center", 
      alignSelf: "center", 
  },
  level: { 
    marginHorizontal: 5,
  //  justifyContent: 'space-around',
    width: windowWidth * 0.25,
    textAlign: 'center',
  },
  musclegroupText: {
    fontSize: wp('2.9%'),
    color: "#696969",
    flexDirection: 'row',
    textAlign: 'center',
    width: wp('28%'),
  },
  valueText: {
    fontSize: wp('2.9%'),
    color: "#E3E7EC",
  },
  imageContainer: {
    backgroundColor: "#20202B",
    borderRadius: wp('10%'),
    width: wp('21%'),
    height: wp('21%'),
    alignItems: 'center',
    justifyContent: 'space-around',

  },
  iconImage: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
    paddingLeft: wp('0%'),
   // justifyContent: 'space-around',
  },
  startButton: {
    marginTop: wp('6%'),
    paddingBottom: wp('8%'),
  },
  buttonStyle: {
    width: '100%',
    paddingVertical: wp('3.5%'),
  },
});
