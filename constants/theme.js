import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export const COLORS = {
    primary: "#a11d1d",
    white: "#E3E7EC",
    background: "#171725",
    //background: "#E3E7EC",
    gray: "#6C6C6C",
    darkgray: "#4A4A65",
    lightgray: "#B9B9B9",
    grey:"#434E58",
    black: "#111111",
    containerbox: "#272636",
    //containerbox: "#d7d7da",
}

export const SIZES = {
    // Global SIZES
    base: 8,
    font: 14,
    radius: 50,
    padding: 8,
    padding2: 12,
    padding3: 16,

    // FONTS Sizes
    largeTitle: 50,
    h1: 48,
    h2: 40,
    h3: 32,
    h4: 24,
    h5: 23,
    h6: 20,
    body1: 18,
    body2: 16,
    body3: 14,
    body4: 12,
    body5: 10,

    // App Dimensions
    width,
    height,
}

export const FONTS = {
    h1: { fontFamily: 'bold', fontSize: SIZES.h1, lineHeight: 56 },
    h2: { fontFamily: 'bold', fontSize: SIZES.h2, lineHeight: 48 },
    h3: { fontFamily: 'bold', fontSize: SIZES.h3, lineHeight: 40 },
    h4: { fontFamily: 'bold', fontSize: SIZES.h4, lineHeight: 32 },
    h5: { fontFamily: 'bold', fontSize: SIZES.h5, lineHeight: 28 },
    h6: { fontFamily: 'semibold', fontSize: SIZES.h6, lineHeight: 26 },
    body1: { fontFamily: 'semibold', fontSize: SIZES.body1, lineHeight: 26 },
    body2: { fontFamily: 'semibold', fontSize: SIZES.body2, lineHeight: 24 },
    body3: { fontFamily: 'semibold', fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontFamily: 'regular', fontSize: SIZES.body4, lineHeight: 20 },
    body5: { fontFamily: 'regular', fontSize: SIZES.body5, lineHeight: 18 },
}

const appTheme = { COLORS, SIZES, FONTS }

export default appTheme