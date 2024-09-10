import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native";
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "../constants";
import Button from '../components/ButtonNoBorder';
import {   getDatabase, push, ref, set, update, remove, get, query, orderByChild, equalTo,} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const DataChecker = ({ route }) => {
  const { trainingId } = route.params;

  const navigation = useNavigation();

  const handleOkPress = async () => {
    try {
      const database = getDatabase();
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
          const trainingRef = ref(
            database,
            `users/${user.uid}/Training/${trainingName}`
          );

          await remove(trainingRef);
          console.log("Training data deleted");
          Alert.alert("Success", "Training data deleted successfully.");
          navigation.navigate("DataMonitor", { id: trainingId });
        }
      });
    } catch (error) {
      console.error("Error deleting training data:", error);
      Alert.alert("Error", "Failed to delete training data. Please try again.");
    }
  }


  return (
<View style={styles.mcontainer}>
    
    <View style={{
      flexDirection: 'row', justifyContent: 'left',
      marginBottom: 0, textAlign: 'left',
 }}>


 </View>

    <View style={styles.container}>
      <View
        style={styles.box}  >
        <Text style={styles.heading}>Training Data Found</Text>
        <Text style={styles.paragraph}>It seems there's pre-existing training data that must be cleared before you can continue. Should we delete it and initiate a new session?</Text>
        <View style={styles.buttonContainer}>
        <TouchableOpacity 
            style={styles.btn}
            onPress={() => handleOkPress(trainingId)}> 
          <Button 
            title="OK"
          /></TouchableOpacity>
 <TouchableOpacity ><Button style={styles.btn2}
            title="Don't allow"
            onPress={() => navigation.navigate("Training")}
          /></TouchableOpacity>
          </View>
       </View>
    </View>
    </View>
    
  );
}



const styles = StyleSheet.create({
  mcontainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding:40,
    height: windowHeight * 0.8,
  },
  topheader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#171725",
    padding:30,
  },
  heading:{
    color:COLORS.white,
    ...FONTS.h5,
    textAlign: "center",
    paddingTop: 30,
    fontSize: windowHeight *0.032,
  },
  disabledBtn: {
    backgroundColor: COLORS.gray,
    borderColor: COLORS.gray, 
   },
  btn:{
    width: '35%',
    marginVertical: 8,
    borderColor: COLORS.primary,
    color:COLORS.primary,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn2:{
    width: '100%',
    marginVertical: 8,
    marginHorizontal:10,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#434E58',
    borderColor: '#434E58',

  },
  paragraph:{
    color:COLORS.gray,
    ...FONTS.body4,
    fontWeight: "300",
    paddingTop: 10,
    textAlign: "center",
    fontSize: windowHeight *0.022,
    width:windowWidth * 0.7,
  },
  buttonContainer: {
    alignItems: "center",
    width:"100%",
    padding:20,
    flexDirection: "row",
    justifyContent: 'space-around',
  },
  box: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.containerbox,
    borderRadius: 20, 
    width:'100%',
    height:windowHeight * 0.42,
    padding:20,
    },
  backButton: {
    marginTop: 35,
    paddingLeft:15,
    },
  });
  export default DataChecker;