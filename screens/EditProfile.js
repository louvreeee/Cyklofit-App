import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, ref, update, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { StyleSheet, ScrollView, Dimensions, View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { FONTS, COLORS, SIZES } from '../constants';
import Button from '../components/Button';
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const EditProfile = ({ navigation, route }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userId = user.uid;
            const userRef = ref(getDatabase(), `users/${userId}`);

            // Set up a listener for real-time updates
            onValue(userRef, (snapshot) => {
              const userData = snapshot.val();
              if (userData) {
                console.log('Real-time User Data:', userData);
                setFirstName(userData.firstName);
                setLastName(userData.lastName);
                setEmail(userData.email);
              }
            });
          }
        });
      } catch (error) {
        console.error('Fetch User Data Error:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserDataInDatabase = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;
        const userRef = ref(getDatabase(), `users/${userId}`);

        // Only update the fields that have changed
        const userDataToUpdate = {};
        if (firstName !== undefined) {
          userDataToUpdate.firstName = firstName;
        }
        if (lastName !== undefined) {
          userDataToUpdate.lastName = lastName;
        }
        if (email !== undefined) {
          userDataToUpdate.email = email;
        }

        await update(userRef, userDataToUpdate);

        console.log('User data updated successfully');

       
        Alert.alert('Success', 'User data updated successfully', [
          {
            text: 'OK',
            onPress: () => {
              
              navigation.goBack();
           
              route.params?.refresh?.();
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Update User Data Error:', error);
     
      Alert.alert('Error', 'Failed to update user data. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-circle" size={55} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '100%' }}>
              <Text style={{ ...FONTS.body2, color: COLORS.white, marginVertical: 8,fontSize:windowHeight * 0.025 }}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor={COLORS.gray}
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
                editable={true}
              />
              <Text style={{ ...FONTS.body2, color: COLORS.white, marginVertical: 8, fontSize:windowHeight * 0.025 }}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor={COLORS.gray}
                value={lastName}
                onChangeText={(text) => setLastName(text)}
                editable={true}
              />
              <Text style={{ ...FONTS.body2, color: COLORS.white, marginVertical: 8,fontSize:windowHeight * 0.025 }}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.gray}
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setEmail(text)}
                editable={true}
              />
              
              <Button
                title="Save Changes"
                style={styles.saveButton}
                onPress={updateUserDataInDatabase}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  input: {
    width: '100%',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
    borderColor: COLORS.darkgray,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    color: COLORS.gray,
    fontFamily: 'regular',
    fontSize: 16,
  },
  scrollContainer: {
    paddingVertical: 24,
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 40,
    alignItems: 'center',
  },
  backButton: {
    marginLeft: 15,
  },
  title: {
    ...FONTS.h5,
    color: COLORS.white,
    marginTop:5,
    marginLeft: windowWidth * 0.2,
  },
  contentContainer: {
    marginTop: -20,
    paddingHorizontal: 22,
    width: '100%',
    justifyContent: 'center',
  },
  saveButton: {
    width: '100%',
    //paddingVertical: 12,
    marginTop: 20,
    marginVertical: 8,
  },
});
