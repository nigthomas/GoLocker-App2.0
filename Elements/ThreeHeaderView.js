import React, { Component} from 'react';
import { StyleSheet, Text, View, Button, FlatList, Dimensions, StatusBar, Image, TextInput, Alert, TouchableHighlight, SafeAreaView} from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import Utils from '../Common/Utils'

export default class HeaderView extends Component {
  onRightPress(){

  }

  onLeftPress() {

  }

  render() {
    const onLeftPress = this.props.onLeftPress || this.onLeftPress
    const onRightPress = this.props.onRightPress || this.onRightPress
    const title = this.props.title || ""
    const leftButtonTitle = this.props.leftButtonTitle || "Back"
    const rightButtonTitle = this.props.rightButtonTitle || ""

    return (
      <SafeAreaView style={{flex: 1, flexDirection:'row', marginTop: 20}}>
        <TouchableHighlight onPress={() => {onLeftPress()}} underlayColor={'transparent'}>
          <View style={{width: 50, height: 50, marginLeft: 21}}>
            <Text style={{color: Colors.gray_85}}>{leftButtonTitle}</Text>
          </View>
        </TouchableHighlight>
        <View style={{flex: 2}}>
          <Text style={{flex: 1,textAlign: 'center', fontWeight: 'bold', color: Colors.dark_gray}}>{title}</Text>
        </View>
        <TouchableHighlight onPress={() => {onRightPress()}} underlayColor={'transparent'}>
          <View style={{height: 50, width: 50, flex: 1, marginRight: 21}}>
            <Text style={{color: Colors.gray_85, textAlign: 'right'}}>{rightButtonTitle}</Text>
          </View>
        </TouchableHighlight>
      </SafeAreaView>
    );
  }
}
