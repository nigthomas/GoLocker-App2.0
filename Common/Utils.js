export default Utils = {
 ifDefNN: (variable) => {
  return !( typeof variable === 'undefined' || variable === null )
  },
  capitalize: (s) => {
    if(!s || s.length == 0) {
      return s
    }

    return s[0].toUpperCase() + s.slice(1);
  }
}
