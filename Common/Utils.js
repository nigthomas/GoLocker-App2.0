import { Dimensions, Platform, PixelRatio } from 'react-native';

export default Utils = {
 ifDefNN: (variable) => {
  return !( typeof variable === 'undefined' || variable === null )
  },
  isIOS: () => {
    return Platform.OS === 'ios'
  },
  haversineDistance: (coords1, coords2, isMiles) => {
    function toRad(x) {
      return x * Math.PI / 180;
    }

    var lon1 = coords1[0];
    var lat1 = coords1[1];

    var lon2 = coords2[0];
    var lat2 = coords2[1];

    var R = 6371; // km

    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    if(isMiles) d /= 1.60934;

    return d;
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
