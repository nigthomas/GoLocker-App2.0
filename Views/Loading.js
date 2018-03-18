import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import Theme from '../Common/Theme'

export default class PackagesView extends Component {
  render() {
    const style = this.props.style || {}
    style.justifyContent = 'center'
    style.flex = 1
    
    return (
      <View style={style}>
        <ActivityIndicator size="large" color={Theme.primaryColor} />
      </View>
    );
  }
}
