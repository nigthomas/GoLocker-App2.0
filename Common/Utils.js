import { Dimensions, Platform, PixelRatio } from 'react-native';

export default Utils = {
 ifDefNN: (variable) => {
  return !( typeof variable === 'undefined' || variable === null )
  },
  capitalize: (s) => {
    if(!s || s.length == 0) {
      return s
    }

    return s[0].toUpperCase() + s.slice(1);
  },
  normalize: (size) => {
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(size))
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(size)) - 2
    }
  }
}
