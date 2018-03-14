import React, { Component} from 'react';
import { StyleSheet, Text, View, Button, FlatList, Dimensions, StatusBar, Image, TextInput, Alert, TouchableHighlight} from 'react-native';
import { Theme } from '../Common/Theme'
import { Colors } from '../Common/Colors'


export class FlatButton extends Component {
  onButtonPress = () => {

  }

  render() {
    const onPress = this.props.onPress || this.onButtonPress
    const backgroundColor = this.props.backgroundColor = Theme.primaryColor
    const color = this.props.color || Colors.white
    const fontSize = this.props.fontSize || 16
    const borderColor = this.props.borderColor || Colors.white
    const title = this.props.title || ""
    const marginTop = this.props.marginTop || 0

    return (
      <TouchableHighlight onPress={onPress}>
        <View style={{backgroundColor: backgroundColor, marginTop: marginTop}}>
          <Text style={{color: color, fontSize: fontSize, borderColor: borderColor, borderWidth: 1, padding: 10, fontWeight: 'bold', textAlign: 'center'}}>{title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}
