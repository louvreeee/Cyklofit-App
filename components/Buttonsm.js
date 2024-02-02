import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native'
import React from 'react'
import { COLORS, FONTS, SIZES } from '../constants'

const Buttonsm = (props) => {
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
                <ActivityIndicator color={COLORS.white} />
            ) : (
                <Text style={{ ...FONTS.body4, color: COLORS.white }}>
                    {props.title}
                </Text>
            )}
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    btn: {
        paddingVertical: 5,
        borderWidth: 2,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
       // width: 100,
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
})

export default Buttonsm