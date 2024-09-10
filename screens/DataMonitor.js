import * as React from 'react';
import { View, StyleSheet, Image, ScrollView, useWindowDimensions, Dimensions, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import GraphTab from './GraphTab';
import MuscleGroup from './MuscleGroup';
import DataTimer from './DataTimer';
import { COLORS, FONTS, SIZES } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const DataMonitor= ({ route, navigation }) => {
  const { id } = route.params; 

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Muscle Map' },
    { key: 'second', title: 'Graph' },
  ]);

  const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <MuscleGroup id={id} />
    </View>
  );

  const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
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

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ paddingTop: 35, flexDirection: "row", paddingLeft:15 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Training')}>
          <Ionicons name="arrow-back-circle" size={55} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={{ ...FONTS.h6, marginLeft: windowWidth * 0.13, fontWeight: "500", marginTop: 20, color: COLORS.white }}>
          Data Monitoring
        </Text>
      </View>

      <View style={{ flex: 2 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          style={{ flex: 1 }}
        />
      </View>
      
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <DataTimer trainingId={id} />
      </ScrollView>
    </View>
  );
};

  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20,
    width:windowWidth,
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
     backgroundColor: COLORS.containerbox,
     borderRadius: 20, 
   width:'100%',
   height:180,
   flex: 1 
},
muscleIndex: {
  alignItems: "center",
  justifyContent: "center",
  marginTop: 20,
     backgroundColor: COLORS.containerbox,
     borderRadius: 20, 
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
});
export default DataMonitor;
