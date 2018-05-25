import React, { Component} from 'react';
import { StatusBar} from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import Utils from '../Common/Utils'


export default class NativeStatusBar extends Component {
  render() {
    const statusBarColor = Utils.isIOS() ? Colors.white : Colors.black
    const barStyle = Utils.isIOS() ? "dark-content" : "light-content"
    return (
      <StatusBar
        backgroundColor={statusBarColor}
        barStyle={barStyle}
      />
    );
  }
}
