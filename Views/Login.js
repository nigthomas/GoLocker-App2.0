import React, { Component } from 'react';
import { Modal, StyleSheet, Text, View, Button, FlatList, Dimensions, StatusBar, Image, TextInput, Alert, TouchableHighlight, Platform, ScrollView, findNodeHandle} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import Storage from '../Common/Storage'
import LoginService from '../Services/LoginService'
import FlatButton from '../Elements/FlatButton'
import AlertView from '../Elements/AlertView'
import OnboardingService from '../Services/OnboardingService'
import OnboardingView from '../Views/Onboarding'

export default class LoginView extends Component {
  static navigationOptions = { title: 'Login', header: null };

  constructor(props) {
   super(props);

   const headerText = (this.props && this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) ? this.props.navigation.state.params.headerText : "Sign in"
   const firstName = (this.props && this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) ? this.props.navigation.state.params.firstName : null

   this.state = {
     username: null,
     password: null,
     shouldShowOnboarding: false,
     loading: true,
     headerText: headerText,
     firstName: firstName
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

  componentDidMount() {
    this.fetch()
  }

  fetch() {
    Promise.all([OnboardingService.getInstance().shouldShowOnboarding()])
    .then(results => {
      this.setState({shouldShowOnboarding: results[0], loading: false})
    })
    .catch(err => {

    })
  }

  goToForgotPassword() {
    var navigate;

    if(this.props.navigation) {
      navigate = this.props.navigation.navigate
    }

    if(this.props.rootNavigation && this.props.rootNavigation.navigate) {
      navigate = this.props.rootNavigation.navigate.navigate
    }

    if(!navigate) {
      return
    }

    navigate('ForgotPasswordView', {navigate: navigate})
  }

  goToRegistration() {
    var navigate;

    if(this.props.navigation) {
      navigate = this.props.navigation.navigate
    }

    if(this.props.rootNavigation && this.props.rootNavigation.navigate) {
      navigate = this.props.rootNavigation.navigate.navigate
    }

    navigate('RegistrationView', {navigate: navigate})
  }

  onOnboardingSkip() {
    this.setState({shouldShowOnboarding: false})
  }

  render() {
    if (this.state.loading) {
      return <View />
    }

    if (this.state.shouldShowOnboarding) {
      return <OnboardingView onSkip={() => {this.onOnboardingSkip()}}/>
    }

    const headerText = `${this.state.headerText} ${this.state.firstName || ""}`

    return (
      <Root>
      <Container>
        <Content style={{backgroundColor: Colors.white}}>
          <View style={styles.background}>
           <View style={{alignItems: 'center', marginTop: 40}}>
             <Image
              style={{width: 145, height: 111}}
              source={require('../Images/go_locker_grayscale.jpg')}
             />
             <Text style={{textAlign: 'center', fontSize: 28, color: Colors.dark_gray, marginTop: 30}}>{headerText}</Text>
           </View>
            <View style={styles.container}>
                <TextInput underlineColorAndroid='transparent' ref="usernameField"  placeholderTextColor={Colors.tapable_blue} style={{color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, textAlign: 'center', fontFamily: Theme.primaryFont}} placeholder={"Your Email"} onChangeText={(username) => this.setState({username})} value={this.state.username}/>
                <TextInput underlineColorAndroid='transparent' ref="passwordField" secureTextEntry={true} placeholderTextColor={Colors.tapable_blue} style={{color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, textAlign: 'center', fontFamily: Theme.primaryFont, marginTop: 5}} placeholder={"Password"} onChangeText={(password) => this.setState({password})} value={this.state.password}/>
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
                <TouchableHighlight onPress={() => {this.goToRegistration()} } underlayColor={'transparent'}>
                  <View>
                    <Text style={{textAlign: 'center', color: Colors.tapable_blue, marginTop: 20}}>Register</Text>
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
