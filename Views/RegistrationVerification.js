import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Alert, Image, TouchableHighlight} from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import FlatButton  from '../Elements/FlatButton'
import PropertyService from '../Services/PropertyService'
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';
import LoginService from '../Services/LoginService'

export default class VerificationView extends Component {
  constructor(props) {
   super(props);

   const { params } = this.props.navigation.state;
   const email = params.email
   const firstName = params.firstName

   this.state = {
     email: email,
     code: null,
     errorMessage: null,
     firstName: firstName
   };
  }

  onLoginPress = () => {
    const { navigation } = this.props;
    navigation.popToTop()
  }

  onVerifyPress() {
    const email = this.state.email
    const code = this.state.code
    const firstName = this.state.firstName
    const { navigation } = this.props;

    if(!code || code.length != 6) {
      this.setState({errorMessage: "Enter 6 digit code"})
      return
    }

    LoginService.getInstance().verifyUser(email, code)
    .then(() => {
      navigation.navigate('Login', {headerText: "Welcome", firstName: firstName})
    })
    .catch(err => {
      this.setState({errorMessage: "Something is wrong or your verification code is incorrect"})
    })
  }

  static navigationOptions = { header: null };
  render() {
    const headerText = "Last step"
    const text = "we promise"
    var errorText = this.state.errorMessage ? <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>{this.state.errorMessage}</Text> : null

    if(!errorText && this.state.error ) {
      errorText = <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>Something is wrong. Please try again</Text>
    }

    return (
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
            <TouchableHighlight onPress={() => {this.onLoginPress()}} underlayColor={'transparent'}>
              <View style={{marginTop: 35, marginRight: 20}}>
                <Text style={{textAlign: 'right', color: Colors.gray_85, fontSize: 16, zIndex: 1}}>Sign in</Text>
              </View>
            </TouchableHighlight>
            <View style={{marginTop: 30}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: 36, color: Colors.dark_gray, fontWeight: 'bold'}}>{headerText}</Text>
              <Text style={{marginLeft: 21, fontSize: 36, color: Colors.dark_gray, fontWeight: 'bold'}}>{text}</Text>
              {errorText}
              <View style={{marginTop: 20}}>
                <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>We just need to verify your number. Enter the code we sent to your phone</Text>
              </View>
              <View style={{marginLeft: 21, marginRight: 21}}>
                <TextInput underlineColorAndroid='transparent' ref="zipField"  maxLength={6} keyboardType='numeric' placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Enter 6 digit code"} onChangeText={(code) => this.setState({code})} value={this.state.code}/>
                <TouchableHighlight onPress={() => {this.onVerifyPress()}} underlayColor={'transparent'}>
                  <View style={{height: 50, borderRadius: 4, backgroundColor: Colors.light_green, marginTop: 10}}>
                    <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>Verify</Text>
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
