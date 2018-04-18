import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Alert, Image, TouchableHighlight} from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import FlatButton  from '../Elements/FlatButton'
import PropertyService from '../Services/PropertyService'
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';

export default class LocationCodeView extends Component {
  constructor(props) {
   super(props);

   this.state = {
     code: null,
     error: null,
     errorMessage: null,
     showNoLocationError: false
   };
  }

  onCheckPress = () => {
    const code = this.state.code
    const { navigation } = this.props;

    if(!code) {
      this.setState({errorMessage: "Please enter a location code"})
      return
    }

    PropertyService.getPropertiesFromLocationCode(code)
    .then(properties => {
      if(properties.length == 0) {
        this.setState({showNoLocationError: true, errorMessage: null})
        return;
      }

      const property = properties[0]
      navigation.navigate('RegistrationForm', {property: property})
    })
    .catch(err => {
      this.setState({error: err})
    })
  }

  onLoginPress = () => {
    const { navigation } = this.props;
    navigation.goBack()
  }

  static navigationOptions = { header: null };
  render() {
    const text = "Let's look up your location code"
    var errorText = this.state.errorMessage ? <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>{this.state.errorMessage}</Text> : null

    if(!errorText && this.state.error ) {
      errorText = <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>Something is wrong. Please try again</Text>
    }

    var noLocationText = this.state.showNoLocationError ? <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>The location code provided is invalid.  Please try again.</Text> : null

    return (
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
            <TouchableHighlight onPress={() => {this.onLoginPress()}} underlayColor={'transparent'}>
              <View style={{marginTop: 35, marginRight: 20}}>
                <Text style={{textAlign: 'right', color: Colors.gray_85, fontSize: 16, zIndex: 1}}>Sign in</Text>
              </View>
            </TouchableHighlight>
            <View style={{marginTop: 30}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Enter your </Text>
              <Text style={{marginLeft: 21, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>location code</Text>
              {errorText}
              {noLocationText}
              <View style={{marginTop: 20}}>
                <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>{text}</Text>
              </View>
              <View style={{marginLeft: 21, marginRight: 21}}>
                <TextInput underlineColorAndroid='transparent' ref="locationCodeField"  maxLength={5} placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Enter location code"} onChangeText={(code) => this.setState({code})} value={this.state.code}/>
                <TouchableHighlight onPress={() => {this.onCheckPress()}} underlayColor={'transparent'}>
                  <View style={{height: 50, borderRadius: 4, backgroundColor: Colors.light_green, marginTop: 10}}>
                    <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>Check</Text>
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
