import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Dimensions, StatusBar, Image, TextInput, Alert, TouchableHighlight, Platform} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import Storage from '../Common/Storage'
import LoginService from '../Services/LoginService'
import FlatButton from '../Elements/FlatButton'
import AlertView from '../Elements/AlertView'
import AccountService from '../Services/AccountService'
import Utils from '../Common/Utils'

export default class ForgotPasswordValidation extends Component {
  constructor(props) {
   super(props);

   const { params } = this.props.navigation.state;
   const email = params.email

   this.state = {
     email: email,
     code: null,
     error: null,
     errorMessage: null
   };
  }

  goToSignIn() {
    const { navigation } = this.props;
    navigation.popToTop()
  }

  onVerify() {
    const code = this.state.code
    const email = this.state.email
    const { navigation } = this.props;

    if(!code) {
      this.setState({errorMessage: "Please enter your verification code"})
      return
    }

    this.setState({errorMessage: null})

    AccountService.getInstance()
    .verifyCode(code, email)
    .then(() => {
      navigation.navigate('NewPassword', {email: email, code: code})
    })
    .catch(err => {
      this.setState({error: err})
    })
  }

  render() {
    const style = this.props.style || {}
    style.justifyContent = 'center'
    style.flex = 1

    var errorText = this.state.errorMessage ? <Text style={{color: Colors.red, marginRight: 21, marginTop: 5}}>{this.state.errorMessage}</Text> : null

    if(!errorText && this.state.error) {
      errorText = <Text style={{color: Colors.red, marginRight: 21, marginTop: 5}}>Something is wrong or your verification code is incorrect. Please try again</Text>
    }

    return (
      <Root>
        <View style={styles.background}>
          <TouchableHighlight onPress={() => {this.goToSignIn()}} underlayColor={'transparent'}>
            <View style={{marginTop: 35, marginRight: 20}}>
              <Text style={{textAlign: 'right', color: Colors.gray_85, fontSize: 16, zIndex: 1}}>Sign in</Text>
            </View>
          </TouchableHighlight>
         <View style={{marginTop: 75, marginLeft: 21, marginRight: 21}}>
          <Text style={{marginTop: 20, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Reset</Text>
          <Text style={{fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>your password?</Text>
          {errorText}
          <View style={{marginTop: 20}}>
            <Text style={{marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>Provide that verification code sent to your email</Text>
          </View>
           <TextInput placeholderTextColor={Colors.tapable_blue} style={{color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, paddingLeft: 21, fontFamily: Theme.primaryFont, marginTop: 25}} placeholder={"Verification Code"} onChangeText={(code) => this.setState({code})} value={this.state.code}/>
           <TouchableHighlight onPress={() => {this.onVerify()}} underlayColor={'transparent'}>
             <View style={{height: 50, borderRadius: 4, backgroundColor: '#7ED321', marginTop: 10}}>
               <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>Verify</Text>
             </View>
           </TouchableHighlight>
         </View>
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.white
  }
});
