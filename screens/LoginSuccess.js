import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import Lottie from 'lottie-react-native';
import WelcomeScreen from '../screens/WelcomeScreen';
import { useNavigation } from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

export default function OnboardingScreen() {
    const navigation = useNavigation();

    const handleDone = ()=>{
        navigation.navigate('Welcome');
       //  setItem('onboarded', '1');
    }

    const doneButton = ({...props})=>{
        return (
            <TouchableOpacity style={styles.doneButton} {...props}>
                <Text>Done</Text>
            </TouchableOpacity>
        )
        
    }
  return (
    <View style={styles.container}>
      <Onboarding
            onDone={handleDone}
            onSkip={handleDone}
            // bottomBarHighlight={false}
            DoneButtonComponent={doneButton}
            containerStyles={{paddingHorizontal: 15}}
            pages={[
                {
                    backgroundColor: '#a7f3d0',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie source={require('../assets/animations/boost.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Meet Your Virtual Training Assistant',
                    subtitle: '',
                },
                {
                    backgroundColor: '#fef3c7',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie source={require('../assets/animations/work.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Monitor Your Muscle Condition',
                    subtitle: ' ',
                },
                {
                    backgroundColor: '#a78bfa',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie source={require('../assets/animations/achieve.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Achieve Higher Goals',
                    subtitle: 'Welcome Lets Train Together',
                },
            ]}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    lottie:{
        width: width*0.9,
        height: width
    },
    doneButton: {
        padding: 20,
        // backgroundColor: 'white',
        // borderTopLeftRadius: '100%',
        // borderBottomLeftRadius: '100%'
    }
})