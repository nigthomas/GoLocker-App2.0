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
  },
  validateEmail: (email) => {
    var emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailValidator.test(String(email).toLowerCase());
  },
  isPasswordComplex: (password) => {
    return (password && password.length >= 8 && //Is >=8 characters
      password != password.toLowerCase() && //Has uppercase character
      /\d/.test(password) &&  //Has numbers
      !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(password))
  }
}
