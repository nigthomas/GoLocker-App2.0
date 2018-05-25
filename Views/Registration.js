import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Alert, Image, TouchableHighlight, SafeAreaView} from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import FlatButton  from '../Elements/FlatButton'
import PropertyService from '../Services/PropertyService'
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';
import ThreeHeaderView from '../Elements/ThreeHeaderView'
import NativeStatusBar from '../Elements/NativeStatusBar'

export default class RegistrationView extends Component {
  constructor(props) {
   super(props);

   this.state = {
     zip_code: null,
     error: null,
     errorMessage: null
   };
  }

  onCheckPress = () => {
    const { navigation } = this.props;
    const zip = this.state.zip_code

    if(!zip || zip.length != 5) {
      this.setState({errorMessage: "Please enter valid zip code"})
      return
    }

    PropertyService.getProperties(this.state.zip_code)
    .then(properties => {
      if(properties.length == 0) {
        navigation.navigate('NoAvailableLockers', {})
        return;
      }

      navigation.navigate('RegistrationSelectLocker', {lockers: properties})
    })
    .catch(err => {
      this.setState({error: err})
    })
  }

  onLoginPress = () => {
    const { navigation } = this.props;
    navigation.goBack()
  }

  goToLocationCode() {
    const { navigation } = this.props;
    navigation.navigate('LocationCode', {})
  }

  static navigationOptions = { header: null };
  render() {
    const text = "Let's check if we have lockers close by"
    var errorText = this.state.errorMessage ? <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>{this.state.errorMessage}</Text> : null

    if(!errorText && this.state.error ) {
      errorText = <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>Something is wrong. Please try again</Text>
    }

    return (
        <Container>
        <NativeStatusBar/>
          <Content style={{backgroundColor: Colors.white}}>
              <SafeAreaView style={{marginTop: 20}}>
                <ThreeHeaderView title={""} leftButtonTitle={"Back"} rightButtonTitle={"Sign in"} onLeftPress={() => {this.onLoginPress()}} onRightPress={() => {this.onLoginPress()}}/>
              </SafeAreaView>
            <View style={{marginTop: 30}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Enter your </Text>
              <Text style={{marginLeft: 21, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>ZipCode</Text>
              {errorText}
              <View style={{marginTop: 20}}>
                <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>{text}</Text>
              </View>
              <View style={{marginLeft: 21, marginRight: 21}}>
                <TextInput underlineColorAndroid='transparent' ref="zipField"  maxLength={5} placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Enter ZIP"} onChangeText={(zip_code) => this.setState({zip_code})} value={this.state.zip_code}/>
                <TouchableHighlight onPress={() => {this.onCheckPress()}} underlayColor={'transparent'}>
                  <View style={{height: 50, borderRadius: 4, backgroundColor: Colors.light_green, marginTop: 10}}>
                    <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>Check</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {this.goToLocationCode()} } underlayColor={'transparent'}>
                  <View>
                    <Text style={{textAlign: 'center', color: Colors.tapable_blue, marginTop: 20}}>I have a location code</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </Content>
        </Container>
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
    backgroundColor: Colors.white,
    marginTop: 60,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: Theme.primaryColor
  }
});
