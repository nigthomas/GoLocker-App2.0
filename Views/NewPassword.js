import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Dimensions, StatusBar, Image, TextInput, Alert, TouchableHighlight, Platform, SafeAreaView} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import Storage from '../Common/Storage'
import LoginService from '../Services/LoginService'
import FlatButton from '../Elements/FlatButton'
import AlertView from '../Elements/AlertView'
import AccountService from '../Services/AccountService'
import Utils from '../Common/Utils'
import ThreeHeaderView from '../Elements/ThreeHeaderView'
import NativeStatusBar from '../Elements/NativeStatusBar'

export default class NewPasswordView extends Component {
  constructor(props) {
   super(props);

   const { params } = this.props.navigation.state;
   const email = params.email
   const code = params.code

   this.state = {
     code: code,
     email: email,
     password: null,
     passwordConfirmation: null,
     error: null,
     errorMessage: null
   };
  }

  goToSignIn() {
    const { navigation } = this.props;
    navigation.popToTop()
  }

  onReset() {
    const password = this.state.password
    const passwordConfirmation = this.state.passwordConfirmation
    const passwordsMatch = password && password.length > 0 && passwordConfirmation === password
    const isComplexPassword = Utils.isPasswordComplex(password)
    const { navigation } = this.props;
    const code = this.state.code
    const email = this.state.email

    if(!password) {
      this.setState({errorMessage: "Please enter your new password"})
      return
    }

    if(!passwordConfirmation) {
      this.setState({errorMessage: "Please confirm your password"})
      return
    }

    if(!passwordsMatch) {
      this.setState({errorMessage: "Passwords don't match"})
      return
    }

    if(!isComplexPassword) {
      this.setState({errorMessage: "Password is too weak or contains invalid characters"})
      return
    }

    this.setState({errorMessage: null})

    AccountService.getInstance()
    .setNewPassword(password, email, code)
    .then(() => {
      navigation.navigate('Login', {headerText: "Please sign in"})
    })
    .catch(err => {
      this.setState({error: err})
    })
  }

  onBackPress() {
    this.props.navigation.goBack()
  }

  render() {
    const style = this.props.style || {}
    style.justifyContent = 'center'
    style.flex = 1

    var errorText = this.state.errorMessage ? <Text style={{color: Colors.red, marginRight: 21, marginTop: 5}}>{this.state.errorMessage}</Text> : null

    if(!errorText && this.state.error) {
      errorText = <Text style={{color: Colors.red, marginRight: 21, marginTop: 5}}>Something is wrong. Please try again</Text>
    }

    const headerText = "You're"

    return (
      <Root>
      <Container>
      <NativeStatusBar/>
        <Content style={{backgroundColor: Colors.white}} ref={c => (this.component = c)}>
        <View style={styles.background}>
        <SafeAreaView style={{marginTop: 35}}>
          <ThreeHeaderView title={""} leftButtonTitle={"Back"} rightButtonTitle={"Sign in"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.goToSignIn()}}/>
        </SafeAreaView>
         <View style={{marginTop: 75, marginLeft: 21, marginRight: 21}}>
          <Text style={{marginTop: 20, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>{headerText}</Text>
          <Text style={{fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>almost done</Text>
          {errorText}
          <View style={{marginTop: 20}}>
            <Text style={{marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>Enter your new password</Text>
          </View>
           <TextInput underlineColorAndroid='transparent' placeholderTextColor={Colors.tapable_blue} style={{color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, textAlign: 'center', fontFamily: Theme.primaryFont, marginTop: 25}} placeholder={"Password"} onChangeText={(password) => this.setState({password})} value={this.state.password}/>
           <TextInput underlineColorAndroid='transparent' placeholderTextColor={Colors.tapable_blue} style={{color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, textAlign: 'center', fontFamily: Theme.primaryFont, marginTop: 10}} placeholder={"Password Confirmation"} onChangeText={(passwordConfirmation) => this.setState({passwordConfirmation})} value={this.state.passwordConfirmation}/>
           <TouchableHighlight onPress={() => {this.onReset()}} underlayColor={'transparent'}>
             <View style={{height: 50, borderRadius: 4, backgroundColor: '#7ED321', marginTop: 10}}>
               <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>Reset</Text>
             </View>
           </TouchableHighlight>
         </View>
        </View>
        </Content>
      </Container>
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
