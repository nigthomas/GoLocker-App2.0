import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Dimensions, StatusBar, Image, TextInput, Alert, TouchableHighlight, Platform, ScrollView, findNodeHandle} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import Storage from '../Common/Storage'
import LoginService from '../Services/LoginService'
import FlatButton from '../Elements/FlatButton'
import AlertView from '../Elements/AlertView'

export default class LoginView extends Component {
  static navigationOptions = { title: 'Login', header: null };
  constructor(props) {
   super(props);

   this.state = {
     username: null,
     password: null
   };
  }

  onLoginPress = () => {
    const username = this.state.username
    const password = this.state.password

    if(!username || !password) {
      AlertView.showConfirmation("Hi there", "Please enter your username and password")
      return;
    }

    LoginService.getInstance().login(username, password)
    .then(account => {

    })
    .catch(err => {
      AlertView.showConfirmation("Whoops! This username and password combination doesn't exist")
    })
  }

  goToForgotPassword() {
    const { navigate }  = this.props.rootNavigation.navigate;
    navigate('ForgotPasswordView', {navigate: navigate})
  }

  inputFocused(ref) {
    const usernameFieldOffset = Platform.OS === 'ios' ? 75 : 125
    const passwordFieldOffset = Platform.OS === 'ios' ? 150 : 170

    if(ref === "usernameField") {
      this._scroll(ref, usernameFieldOffset);
      return
    }

    this._scroll(ref, passwordFieldOffset);
  }

  inputBlurred(ref) {
    this._scroll(ref, 0);
  }

  _scroll(ref, offset) {
    setTimeout(() => {
      var scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                 findNodeHandle(this.refs[ref]),
                 offset,
                 true
             );
      }, 50);
  }

  render() {
    return (
      <Root>
        <ScrollView ref="scrollView" keyboardDismissMode='interactive' style={{backgroundColor: Colors.white}}>
          <View style={styles.background}>
           <View style={{alignItems: 'center', marginTop: 40}}>
             <Image
              style={{width: 145, height: 111}}
              source={require('../Images/go_locker_grayscale.jpg')}
             />
             <Text style={{textAlign: 'center', fontSize: 28, color: Colors.dark_gray, marginTop: 30}}>Sign in</Text>
           </View>
            <View style={styles.container}>
                <TextInput underlineColorAndroid='transparent' ref="usernameField" onFocus={this.inputFocused.bind(this, 'usernameField')} onBlur={this.inputBlurred.bind(this, 'usernameField')} placeholderTextColor={Colors.tapable_blue} style={{color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, textAlign: 'center', fontFamily: Theme.primaryFont}} placeholder={"Your Email"} onChangeText={(username) => this.setState({username})} value={this.state.username}/>
                <TextInput underlineColorAndroid='transparent' ref="passwordField" secureTextEntry={true} onFocus={this.inputFocused.bind(this, 'passwordField')} onBlur={this.inputBlurred.bind(this, 'passwordField')} placeholderTextColor={Colors.tapable_blue} style={{color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, textAlign: 'center', fontFamily: Theme.primaryFont, marginTop: 5}} placeholder={"Password"} onChangeText={(password) => this.setState({password})} value={this.state.password}/>
                <TouchableHighlight onPress={this.onLoginPress} underlayColor={'transparent'}>
                  <View style={{height: 50, borderRadius: 4, backgroundColor: Colors.light_green, marginTop: 10}}>
                    <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>Sign In</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {this.goToForgotPassword()} } underlayColor={'transparent'}>
                  <View>
                    <Text style={{textAlign: 'center', color: Colors.tapable_blue, marginTop: 20}}>Forgot your password?</Text>
                  </View>
                </TouchableHighlight>
            </View>
        </View>
      </ScrollView>
    </Root>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 50,
  },
  container: {
    flex: 1,
    marginTop: 50,
    paddingTop: 10,
    backgroundColor: Colors.white
  },
  emailTextInput: {
    height: 50,
    fontSize: 18,
    color: Theme.secondaryColor,
    borderBottomWidth: 1,
    borderColor: Colors.white
  },
  passwordTextInput: {
    height: 50,
    fontSize: 18,
    color: Theme.secondaryColor,
    borderBottomWidth: 1,
    borderColor: Colors.white,
    marginBottom: 15
  },
  textLabel: {
      fontSize: 20,
      fontWeight: 'bold',
      fontFamily: 'Verdana',
      marginBottom: 10,
      color: '#595856'
  },
  loginButton: {
  }
});
