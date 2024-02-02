import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import Button from '../components/Button';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';
import { getDatabase, ref, push, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { getFirebaseApp, writeUserData } from '../utils/firebaseHelper';
import { AsyncStorage } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const isTestMode = true;

const initialState = {
  inputValues: {
    firstName: isTestMode ? 'John' : '',
    lastName: isTestMode ? 'Doe' : '',
    email: isTestMode ? 'example@gmail.com' : '',
    password: isTestMode ? '**********' : '',
    confirmPassword: isTestMode ? '**********' : '',
  },
  inputValidities: {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  },
  formIsValid: false,
};

const Signup = ({ navigation }) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState(initialState);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      setFormState((prevState) => ({
        ...prevState,
        inputValues: {
          ...prevState.inputValues,
          [inputId]: inputValue,
        },
        inputValidities: {
          ...prevState.inputValidities,
          [inputId]: result,
        },
        formIsValid: Object.values(prevState.inputValidities).every(Boolean),
      }));
    },
    []
  );

  const authHandler = async () => {
    try {
      setIsLoading(true);
  
      if (formState.inputValues.password !== formState.inputValues.confirmPassword) {
        throw new Error('Passwords do not match');
      }
  
      const auth = getAuth(getFirebaseApp());
  
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formState.inputValues.email,
        formState.inputValues.password
      );
  
      const uid = userCredential.user.uid;
  
      // Update user profile in Firebase Authentication
      await updateProfile(userCredential.user, {
        displayName: formState.inputValues.firstName,
      });
  
      // Add user data to the Realtime Database using the same UID
      await writeUserData(
        uid,
        formState.inputValues.firstName,
        formState.inputValues.lastName,
        formState.inputValues.email,
        // You can pass the profile picture URL here if needed
      );
  
      Alert.alert('Thank You', 'You\'re all signed up.');
      setError(null);
      setIsLoading(false);
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setError(error.message);
    }
  };
  // Function to fetch user data by email
  const fetchUserDataByEmail = async (email) => {
    const database = getDatabase(getFirebaseApp());
    const usersRef = ref(database, 'users');

    try {
      const queryByEmail = query(usersRef, orderByChild('email'), equalTo(email));
      const snapshot = await get(queryByEmail);

      if (snapshot.exists()) {
        const userId = Object.keys(snapshot.val())[0];
        return snapshot.val()[userId];
      }

      return null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const [isPasswordShown, setIsPasswordShown] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.background, padding: 16 }}
      >
        <View
          style={{
            flexDirection: 'row', justifyContent: 'left',
            marginBottom: 0,
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}
            className=""><Ionicons name="arrow-back-circle" size={55} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={{ ...FONTS.h5, color: COLORS.white, marginLeft: 50, fontSize:windowHeight * 0.030,  }}>Create account</Text>
        </View>
        <View style={{ marginVertical: 10 }}>
          <View style={{ marginBottom: 0 }}>
            <Text style={{ ...FONTS.body2, color: COLORS.white, marginVertical: 8 }}>First Name</Text>
            <Input
              id="firstName"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities["firstName"]}
              placeholder="Enter your first name"
              placeholderTextColor={COLORS.gray}
            />
          </View>
          <View style={{ marginBottom: 0 }}>
            <Text style={{ ...FONTS.body2, color: COLORS.white, marginVertical: 8, fontSize:windowHeight * 0.02, }}>Last Name</Text>
            <Input
              id="lastName"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities["lastName"]}
              placeholder="Enter your last name"
              placeholderTextColor={COLORS.gray}
            />
          </View>
          <View style={{ marginBottom: 0 }}>
            <Text style={{ ...FONTS.body2, color: COLORS.white, marginVertical: 8, fontSize:windowHeight * 0.02, }}>Email</Text>
            <Input
              id="email"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities["email"]}
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.gray}
              keyboardType="email-address"
            />
          </View>
          <View style={{ marginBottom: 0 }}>
            <Text style={{
              ...FONTS.body2,
              color: COLORS.white,
              marginVertical: 8, fontSize:windowHeight * 0.02,
            }}>Password</Text>

            <View style={{ flexDirection: "row" }}>
              <Input
                placeholderTextColor={COLORS.gray}
                secureTextEntry={isPasswordShown}
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities["password"]}
                autoCapitalize="none"
                id="password"
                placeholder="Create a password"
                style={{
                  width: "100%"
                }}
              />

              <TouchableOpacity
                onPress={() => setIsPasswordShown(!isPasswordShown)}
                style={{
                  position: "absolute",
                  paddingTop: 25,
                  right: 12
                }}
              >
                {
                  isPasswordShown == false ? (
                    <Ionicons name="eye-off" size={24} color={COLORS.white} />
                  ) : (
                    <Ionicons name="eye" size={24} color={COLORS.white} />
                  )
                }

              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{
              ...FONTS.body2,
              color: COLORS.white,
              marginVertical: 8, fontSize:windowHeight * 0.02,
            }}>Confirm Password</Text>

            <View style={{ flexDirection: "row" }}>
              <Input
                placeholderTextColor={COLORS.gray}
                secureTextEntry={isPasswordShown}
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities["confirmPassword"]}
                autoCapitalize="none"
                id="confirmPassword"
                placeholder="Retype password"
                style={{
                  width: "100%"
                }}
              />

              <TouchableOpacity
                onPress={() => setIsPasswordShown(!isPasswordShown)}
                style={{
                  position: "absolute",
                  paddingTop: 25,
                  right: 12
                }}
              >
                {
                  isPasswordShown == false ? (
                    <Ionicons name="eye-off" size={24} color={COLORS.white} />
                  ) : (
                    <Ionicons name="eye" size={24} color={COLORS.white} />
                  )
                }

              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginVertical: 0, paddingBottom: 50 }}>
            <Button
              title="Continue with Email"
              onPress={authHandler}
              isLoading={isLoading}
              style={{
                width: SIZES.width - 32,
                marginVertical: 8,
              }}
            />
            <View
              style={styles.bottomContainer}>
              <Text style={{ ...FONTS.body3, color: COLORS.gray }}>
                Already have an account? {" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={{ ...FONTS.body3, color: COLORS.primary }}>Login</Text>

              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },

});

export default Signup;
