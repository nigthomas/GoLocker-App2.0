import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export class RegistrationView extends Component {
  static navigationOptions = {
    title: 'More',
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>Registration!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
