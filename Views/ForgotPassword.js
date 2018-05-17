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

export default class ForgotPassword extends Component {

  constructor(props) {
   super(props);

   this.state = {
     username: null,
     error: null,
     errorMessage: null
   };
  }

  goToSignIn() {
    const { navigation } = this.props;
    navigation.goBack()
  }

  onResetPassword() {
    const email = this.state.username
    const { navigation } = this.props;

    if(!email || !Utils.validateEmail(email)) {
      this.setState({errorMessage: "Please enter a valid email address"})
      return
    }

    this.setState({errorMessage: null})

    AccountService.getInstance()
    .resetPassword(email)
    .then(() => {
      navigation.navigate('ForgotPasswordValidation', {email: email})
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

    return (
      <Root>
        <Container>
        <Content style={{backgroundColor: Colors.white}} ref={c => (this.component = c)}>
        <View style={styles.background}>
          <SafeAreaView style={{marginTop: 35}}>
            <ThreeHeaderView title={""} leftButtonTitle={"Back"} rightButtonTitle={"Sign in"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.goToSignIn()}}/>
          </SafeAreaView>
         <View style={{marginTop: 75, marginLeft: 21, marginRight: 21}}>
          <Text style={{marginTop: 20, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Forgot</Text>
          <Text style={{fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>your password?</Text>
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>We can help you with that</Text>
          </View>
          {errorText}
           <TextInput underlineColorAndroid='transparent'  placeholderTextColor={Colors.tapable_blue} style={{color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, paddingLeft: 21, fontFamily: Theme.primaryFont, marginTop: 25}} placeholder={"Your Email"} onChangeText={(username) => this.setState({username})} value={this.state.username}/>

           <TouchableHighlight onPress={() => {this.onResetPassword()}} underlayColor={'transparent'}>
             <View style={{height: 50, borderRadius: 4, backgroundColor: '#7ED321', marginTop: 10}}>
               <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>Send Recovery Code</Text>
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
