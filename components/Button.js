import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Dimensions
} from 'react-native'
import React from 'react'
import { COLORS, FONTS, SIZES } from '../constants'
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const Button = (props) => {
    const isLoading = props.isLoading || false

    return (
        <TouchableOpacity
            style={{
                ...styles.btn,
                ...props.style,
            }}
            onPress={props.onPress}
        >
            {isLoading && isLoading == true ? (
                <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
                <Text style={{ ...FONTS.body2, fontSize: windowHeight * 0.025, color: COLORS.white }}>
                    {props.title}
                </Text>
            )}
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    btn: {
        paddingHorizontal: SIZES.padding,
        paddingVertical: windowWidth * 0.025,
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
    },
})

export default Button