import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Alert } from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import FlatButton  from '../Elements/FlatButton'
import PropertyService from '../Services/PropertyService'

export default class RegistrationView extends Component {
  constructor(props) {
   super(props);

   this.state = {
     zip_code: null
   };
  }

  onCheckPress = () => {
    const { navigation } = this.props;

    if(!this.state.zip_code) {
      Alert.alert('', "Please enter zip code",[{text: 'OK', onPress: () => {}}],{ cancelable: false })
      return;
    }

    PropertyService.getProperties(this.state.zip_code)
    .then(properties => {
      console.log(properties)
    })
    .catch(err => {
      Alert.alert('', "Whoops! An error occurred. Please try again.",[{text: 'OK', onPress: () => {}}],{ cancelable: false })
    })
  }

  onLoginPress = () => {
    const { navigation } = this.props;
    navigation.goBack()
  }


  static navigationOptions = { title: 'Registration', header: null };
  render() {
    const enter_zip = "Enter your ZipCode"
    const lets_check = "Let's check if we have lockers close by"
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content"/>
        <View style={styles.background}>
          <Text style={{color: Colors.black_3c, fontSize: 20}}>{enter_zip}</Text>
          <Text style={{color: Colors.black_3c, fontSize: 13, marginTop: 10}}>{lets_check}</Text>
          <TextInput style={styles.zipCodeInput} underlineColorAndroid={'transparent'} placeholder="Zip code" onChangeText={(zip_code) => this.setState({zip_code})} value={this.state.zip_code}/>
          <FlatButton style={{backgroundColor: 'transparent', marginTop: 10, width: '90%', marginLeft: '2.5%'}} onPress={this.onCheckPress} title={"Check"}/>
          <FlatButton style={{marginTop: 10, backgroundColor: 'transparent'}} borderColor={Theme.primaryColor} fontSize={14} onPress={this.onLoginPress} title={"Login"}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  zipCodeInput: {
    marginTop: 20,
    height: 50,
    width: '90%',
    marginLeft: '2.5%',
    paddingLeft: '2.5%',
    fontSize: 16,
    backgroundColor: Colors.white
  },
  background: {
    flex: 1,
    backgroundColor: Theme.primaryColor,
    marginTop: 60,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: Theme.primaryColor
  }
});
