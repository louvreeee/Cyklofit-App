import {
  getApp,
  getApps,
  initializeApp,
} from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as signInWithEmailAndPasswordAuth,
  signOut,
  updateProfile,
  getAuth,
} from 'firebase/auth';
import {
  getDatabase,
  push,
  ref,
  set,
  update,
  remove,
  get,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database';

import AsyncStorage from '@react-native-async-storage/async-storage';

let firebaseApp;

export const getFirebaseApp = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  const firebaseConfig = {
    apiKey: "AIzaSyD67BuqU0b4tMS2aDGn_7YQo5_0O_UqhBM",
    authDomain: "pd-test-b7811.firebaseapp.com",
    databaseURL: "https://pd-test-b7811-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pd-test-b7811",
    storageBucket: "pd-test-b7811.appspot.com",
    messagingSenderId: "127494095524",
    appId: "1:127494095524:web:69b7f6ee317c2a63491c31",
    measurementId: "G-QN6X91BV08"
  };

  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    
    // Initialize Firebase Authentication with AsyncStorage persistence
    initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

    return firebaseApp;
  } else {
    // Firebase app is already initialized, return the existing app
    return getApps()[0];
  }
};

export const signUpWithEmailAndPassword = async (email, password, displayName) => {
  const auth = getAuth(getFirebaseApp());

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    // Write user data to Realtime Database with UID
    const userId = userCredential.user.uid;
    await writeUserData(userId, displayName, email, '');

    return userCredential.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signInWithEmailAndPassword = async (email, password) => {
  const auth = getAuth(firebaseApp);

  try {
    const userCredential = await signInWithEmailAndPasswordAuth(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signOutUser = async () => {
  const auth = getAuth(firebaseApp);

  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const writeUserData = async (userId, firstname, lastname, email, imageUrl) => {
  const database = getDatabase(getFirebaseApp());
  const usersRef = ref(database, `users/${userId}`);

  try {
    // Use set instead of update to ensure the UID is the child node
    await set(usersRef, {
      uid: userId,
      firstName: firstname,
      lastName: lastname,
      email: email,
      // profile_picture: imageUrl,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUserData = async (userId, userData) => {
  const database = getDatabase(firebaseApp);
  const userRef = ref(database, `users/${userId}`);

  try {
    await update(userRef, userData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUserData = async (userId) => {
  const database = getDatabase(firebaseApp);
  const userRef = ref(database, `users/${userId}`);

  try {
    await remove(userRef);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchUserData = async (userId) => {
  const database = getDatabase(firebaseApp);
  const userRef = ref(database, `users/${userId}`);

  try {
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No data available');
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchGraphData = async (userId) => {
  const database = getDatabase(getFirebaseApp());
  const userGraphDataRef = ref(database, `users/${userId}/Signal/linegraph`);

  try {
    const snapshot = await get(userGraphDataRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No data available');
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const fetchUserDataByEmail = async (email) => {
  const database = getDatabase(firebaseApp);
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