import React, { Component } from 'react';
import { View, ActivityIndicator, Text} from 'react-native';
import Theme from '../Common/Theme'

export default class PackagesView extends Component {
  render() {
    const style = this.props.style || {}
    style.justifyContent = 'center'
    style.flex = 1

    return (
      <View style={style}>
        <Text style={{textAlign: 'center', fontWeight: '500', fontSize: 18}}>Loading...</Text>
      </View>
    );
  }
}
