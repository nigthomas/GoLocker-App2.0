import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Theme } from '../Common/Theme'
import { Colors } from '../Common/Colors'

export class RegistrationView extends Component {
  static navigationOptions = { title: 'Registration', header: null };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content"/>
        <Text style={{color: Colors.white}}>Registration!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
