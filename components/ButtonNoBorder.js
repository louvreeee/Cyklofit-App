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
                <Text style={{ ...FONTS.body3, fontSize: windowHeight * 0.021, color: COLORS.white }}>
                    {props.title}
                </Text>
            )}
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    btn: {
        paddingHorizontal: windowWidth * 0.012,
        paddingVertical: windowWidth * 0.012,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default Button