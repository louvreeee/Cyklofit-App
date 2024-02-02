import React, { createContext, useState } from 'react'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const AuthContext = createContext({});
GoogleSignin.configure();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const user = await GoogleSignin.signIn();
        setUser(user);
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
          setLoading(false);
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (e.g. sign in) is in progress already
          setLoading(true);
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
          setLoading(false);
        } else {
          // some other error happened
          setLoading(false);
        }
      }
  }
  return (
    <AuthContext.Provider value={{
        user,
        signInWithGoogle,
        loading,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default useAuth = () => useContext(AuthContext);