import React, { Component} from 'react';
import { StyleSheet, Text, View, Button, FlatList, Dimensions, StatusBar, Image, TextInput, Alert, TouchableHighlight} from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import Utils from '../Common/Utils'

export default class HeaderView extends Component {
  onPress = () => {

  }

  render() {
    const onPress = this.props.onPress || this.onPress
    const title = this.props.title || ""
    const details = this.props.details || ""

    return (
      <TouchableHighlight onPress={onPress} underlayColor={'transparent'}>
        <View>
          <Text style={{textAlign: 'center', fontWeight: '600', fontSize: Utils.normalize(16)}}>{title}</Text>
          <Text style={{textAlign: 'center', fontSize: Utils.normalize(11), color: Colors.gray_b5}}>{details}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}
