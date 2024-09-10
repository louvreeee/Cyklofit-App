import { View, Text, Image, Alert, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SIZES, images } from "../constants";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducers";
import Input from "../components/Input";
import Button from "../components/Button";
import { signIn } from "../utils/actions/authActions";
import { useDispatch} from "react-redux";
import { Ionicons } from "@expo/vector-icons";
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const isTestMode = true;

const initialState = {
  inputValues: {
    email: isTestMode ? "example@gmail.com" : "",
    password: isTestMode ? "**********" : "",
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};
const signIn2 = async () => {
  try {
    const userInfo = await GoogleOneTapSignIn.signIn2({
      webClientId: config.webClientId,
      iosClientId: config.iosClientId, // only needed if you're not using Firebase config file
      nonce: 'your_nonce',
    });
    setState({ userInfo });
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.NO_SAVED_CREDENTIAL_FOUND:
          // no saved credential found, try creating an account
          break;
        case statusCodes.SIGN_IN_CANCELLED:
          // sign in was cancelled
          break;
        case statusCodes.ONE_TAP_START_FAILED:
          // Android and Web only, you probably have hit rate limiting. You can still call the original Google Sign In API in this case.
          break;
        default:
        // something else happened
      }
    } else {
      // an error that's not related to google sign in occurred
    }
  }
};
const Login = ({ navigation }) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const dispatch = useDispatch()

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  const authHandler = async () => {
    try {
      setIsLoading(true);
  
      // Check if email and password are not empty
      if (!formState.inputValues.email.trim() || !formState.inputValues.password.trim()) {
        throw new Error("Email and password are required.");
      }
  
      const action = signIn(
        formState.inputValues.email,
        formState.inputValues.password
      );
      await dispatch(action);
      setError(null);
      await new Promise((resolve) => {
       {/*} Alert.alert(
          "Login Successful",
          "You have successfully logged into Cyklofit.",
          [{ text: "OK", onPress: resolve }]
       );*/}
        navigation.navigate("LoginSuccess");
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error);
    }
  }, [error]);
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
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
      
          <TouchableOpacity onPress={()=> navigation.goBack()} 
          className=""><Ionicons name="arrow-back-circle" size={55} color={COLORS.white} />
          </TouchableOpacity>
      
        <Text style={{ ...FONTS.h5,fontSize:windowHeight * 0.030, color: COLORS.white, marginLeft:windowWidth * 0.25, }}>Login</Text>
       </View>
        <View style={{ marginVertical: 22 }}>
        <View style={{ marginBottom: 12 }}>
        <Text style={{...FONTS.body2,color:COLORS.white, marginVertical: 8,  fontSize:windowHeight * 0.025
                    }}>Email</Text>
           <Input
            id="email"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["email"]}
            placeholder="Enter your email address"
            placeholderTextColor={COLORS.gray}
            keyboardType="email-address"
          />
        </View>
          <View style={{ marginBottom: 12 }}>
        
                    <Text style={{
                       ...FONTS.body2,
                        color:COLORS.white,
                        marginVertical: 8,
                        fontSize:windowHeight * 0.025
                    }}>Password</Text>

                    <View style={ {flexDirection: "row"} }>
                        <Input
                            placeholderTextColor={COLORS.gray}
                            secureTextEntry={isPasswordShown}
                            onInputChanged={inputChangedHandler}
                            errorText={formState.inputValidities["password"]}
                            autoCapitalize="none"
                            id="password"
                            placeholder="Enter your password"
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
                                isPasswordShown == true? (
                                    <Ionicons name="eye-off" size={24} color={COLORS.white} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={COLORS.white} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>
          <Button
            title="Login"
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
              Don't have an account? {" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={{ ...FONTS.body3, color: COLORS.primary }}>Sign Up</Text>
            </TouchableOpacity>
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

export default Login;
