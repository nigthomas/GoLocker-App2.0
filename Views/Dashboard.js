import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

export class DashboardView extends Component {
  static navigationOptions = { title: 'Dashboard', header: null };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content"/>
        <Text>Dashboard</Text>
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
