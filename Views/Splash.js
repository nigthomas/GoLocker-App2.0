import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from './Common/Theme'

export class SplashView extends Component {
  static navigationOptions = {
    title: 'More',
  };
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
    backgroundColor: Theme.primaryColor
  },
});
