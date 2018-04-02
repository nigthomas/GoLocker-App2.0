import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'

export default class SplashView extends Component {
  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
});
