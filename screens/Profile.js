import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/Input';
import Button from '../components/Button';
import { getDatabase, ref, get, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { images, FONTS, COLORS, SIZES } from '../constants';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch, Dimensions
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';


const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const Profile = ({ navigation }) => {
  const [form, setForm] = useState({
    language: 'English',
    darkMode: true,
    wifi: false,
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        console.log("User UID:", userId);

        const userRef = ref(getDatabase(), `users/${userId}`);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          console.log("User Data:", userData);

          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(userData.email);
        }

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

    return () => {
      // Unsubscribe when the component unmounts
      unsubscribe();
    };
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

      const SECTIONS = [
        { header: 'Settings',
          items: [
            { id: '1', label: 'Edit Profile', type: 'link', screen: 'EditProfile' },
            { id: '2', label: 'Contact Us', type: 'link', screen: 'EditProfile' },
         //   { id: '3', label: 'Settings', type: 'link', screen: 'EditProfile' },
          ],
        },
      ];
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <ScrollView contentContainerStyle={styles.container}>
         {/*  <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>*/}
  
          <View style={styles.profile}>
       
  
  <Text style={styles.profileName}>{firstName} {lastName}</Text>
  <Text style={styles.profileEmail}>{email}</Text>
  
          </View>
  
         
   
   
            <View style={styles.sectionBody}>
              <View style={{ borderBottomWidth: 1 * 0.5, borderColor: COLORS.gray, }}>
              {SECTIONS[0].items.map(({ id, label, type, screen }) => (
                  <TouchableOpacity
                    key={id} 
                    style={styles.rowWrapper}
                    onPress={() => {
                      if (screen) {
                        navigation.navigate(screen);
                      }
                    }}
                  >
                    <View style={styles.row}>
                  

                      <Text style={styles.rowLabel}>{label}</Text>

                      <View style={styles.rowSpacer} />

                      {type === 'select' && (
                        <Text style={styles.rowValue}>{form[id]}</Text>
                      )}

                      {type === 'toggle' && (
                        <Switch
                          onChange={val => setForm({ ...form, [id]: val })}
                          value={form[id]}
                        />
                      )}

                      {(type === 'select' || type === 'link') && (
                        <FeatherIcon
                          color="#ababab"
                          name="chevron-right"
                          size={22}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          
          <View style={{ flex: 1, alignItems: 'center' }}>
                

                    {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            style={styles.logoutButton}
            onPress={() => {
              handleLogout();
              navigation.navigate('Onboarding');
            }}
          />
        </View>
        
                </View>
        </ScrollView>
                
             
           
        </SafeAreaView>
    )
}

export default Profile
  
  const styles = StyleSheet.create({
    container: {
     // paddingVertical: 24,
      padding: 10,
      backgroundColor: COLORS.background,
      height: '100%',
      flex:1,
    },
    section: {
     
    },
    sectionBody: {
     // borderTopWidth: 1,
      backgroundColor: COLORS.background,
      padding: 20,
    },
    header: {
      paddingLeft: 24,
      paddingRight: 24,
      marginBottom: 12,
    },
    title: {
        ...FONTS.h5,
      color: COLORS.white,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 15,
      fontWeight: '500',
      color: COLORS.white,
    },
    profile: {
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 16,
      flexDirection: 'column',
      //alignItems: 'center',
      backgroundColor: COLORS.background,
     
    },
    logoutContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: 78,
      alignItems: "center",
      width: windowWidth, 
      padding:20,
      
    },
    logoutButton: {
      width: '100%',
     // paddingVertical: 12,
      paddingHorizontal: 22,
      marginVertical: 8,
    },
    profileAvatar: {
      width: 60,
      height: 60,
      borderRadius: 9999,
    },
    profileName: {
      marginTop: 12,
      ...FONTS.h6,
      fontWeight: '600',
      color: COLORS.white,
    },
    profileEmail: {
      marginTop: 6,
      ...FONTS.body2,
      fontWeight: '200',
      color: '#848484',
    },
    profileAction: {
      marginTop: 12,
      paddingVertical: 10,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.background,
      borderRadius: 12,
    },
    profileActionText: {
      marginRight: 8,
      fontSize: 15,
      fontWeight: '600',
      color: '#fff',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
     // paddingRight: 24,
      height: 60,
    },
    rowWrapper: {
     // paddingLeft: 24,
      backgroundColor: COLORS.background,
      borderTopWidth: 1*0.5,
      borderColor: COLORS.gray,
    },
    rowIcon: {
     // marginRight: 12,
    },
    rowLabel: {
      ...FONTS.body2,
      fontWeight: '500',
      color: COLORS.white,
    },
    rowValue: {
      fontSize: 17,
      color: '#616161',
      marginRight: 4,
    },
    rowSpacer: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
  });