import React, { Component } from 'react';
import { Modal, StyleSheet, Text, View, Button, FlatList, Dimensions, StatusBar, Image, TextInput, Alert, TouchableHighlight, Platform, ScrollView, findNodeHandle, Switch} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import Storage from '../Common/Storage'
import LoginService from '../Services/LoginService'
import FlatButton from '../Elements/FlatButton'
import AlertView from '../Elements/AlertView'
import OnboardingService from '../Services/OnboardingService'
import OnboardingView from '../Views/Onboarding'
import { NetworkStatusListener } from '../Common/NetworkManager'
import TouchID from 'react-native-touch-id'
import * as Keychain from 'react-native-keychain';

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
     firstName: firstName,
     signInText: "Sign In",
     signInColor: Colors.light_green,
     showTouchIdSwitch: false,
     touchIDSwitchEnabled: true,
     showedTouchIdFlow: false
   };
  }

  onLoginPress = () => {
    const username = this.state.username
    , password = this.state.password
    , touchIDSwitchEnabled = this.state.touchIDSwitchEnabled

    if(!username || !password) {
      Alert.alert("Hi there", "Please enter your username and password",[{text: 'OK', onPress: () => {}}],{ cancelable: true })
      return;
    }

    this.showProcessingState()
    LoginService.getInstance().login(username, password)
    .then(finishLoginFunction => {
      if(!this.state.showTouchIdSwitch || !touchIDSwitchEnabled) {
          this.showRegularState()
          finishLoginFunction()
          return;
      }

      return TouchID.authenticate("Authenticate with TouchID/FaceID to securely save your credentials.")
      .then(success => {
        if(success) {
          return Keychain.setGenericPassword(username, password)
        }

        return new Promise((resolve, reject) => { resolve()})
      })
      .then(() => {
        finishLoginFunction()
        this.showRegularState()
      })
      .catch(error => {
        console.log(error)
        finishLoginFunction()
      });

    })
    .catch(err => {
      console.log(err)
      this.showRegularState()
      Alert.alert("Whoops!", "This username and password combination doesn't exist",[{text: 'OK', onPress: () => {}}],{ cancelable: true })
    })
  }

  componentDidMount() {
    this.fetch()

    NetworkStatusListener.getInstance()
    .getListener()
    .on("FORCE_LOGOUT", () => {
      this.setState({headerText: "Your session has expired"})
    })
  }

  startTouchIdFlow() {
    const showedTouchIdFlow = this.state.showedTouchIdFlow;

    if(showedTouchIdFlow) {
      return new Promise((resolve, reject) => { resolve()})
    }

    this.setState({showedTouchIdFlow: true})

    return TouchID.isSupported()
    .then(biometryType => {
      const showTouchIdSwitch = (biometryType === 'FaceID' || biometryType === 'TouchID' || biometryType === true)
      this.setState({showTouchIdSwitch: showTouchIdSwitch})
      return Promise.all([Keychain.getGenericPassword(), new Promise((resolve, reject) => { resolve(showTouchIdSwitch)})])
    })
    .then(results => {
      const credentials = results[0]
      , showTouchIdSwitch = results[1]
      ;

      if(!showTouchIdSwitch || !(credentials.username && credentials.password)) {
        return new Promise((resolve, reject) => { resolve()})
      }

      return TouchID.authenticate("Authenticate with TouchID/FaceID to log in.")
      .then(success => {
        if(success) {
         this.showProcessingState()
         return LoginService.getInstance().login(credentials.username, credentials.password)
         .then(finishLoginFunction => {
           this.showRegularState()
           finishLoginFunction()
         })
         .catch(err => {
           this.showRegularState()
           Alert.alert("Whoops!", "This username and password combination doesn't exist",[{text: 'OK', onPress: () => {}}],{ cancelable: true })

           Keychain.resetGenericPassword()
           .then(() => {})
           .catch(err => {})

         })
        }
      })
    })
    .catch(err => {
    })
  }

  fetch() {
    Promise.all([OnboardingService.getInstance().shouldShowOnboarding()])
    .then(results => {
      const shouldShowOnboarding = results[0]
      this.setState({shouldShowOnboarding: shouldShowOnboarding, loading: false})

      if(!shouldShowOnboarding) {
        return this.startTouchIdFlow()
      }
    })
    .catch(err => {
      console.log(err)
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

    this.showRegularState()
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

    this.showRegularState()
    navigate('RegistrationView', {navigate: navigate})
  }

  showProcessingState() {
    this.setState({signInText: "Signing in...", signInColor: Colors.gray_85})
  }

  showRegularState() {
    this.setState({signInText: "Sign in", signInColor: Colors.light_green})
  }

  onOnboardingSkip() {
    this.setState({shouldShowOnboarding: false})

    this.startTouchIdFlow()
    .then(() => {

    })
    .catch(err => {

    })
  }

  render() {
    if (this.state.loading) {
      return <View />
    }

    if (this.state.shouldShowOnboarding) {
      return <OnboardingView onSkip={() => {this.onOnboardingSkip()}}/>
    }

    const headerText = `${this.state.headerText} ${this.state.firstName || ""}`
    , touchIDSwitchEnabled = this.state.touchIDSwitchEnabled
    , showTouchIdSwitch = this.state.showTouchIdSwitch
    ;

    return (
      <Root>
      <Container>
        <Content style={{backgroundColor: Colors.white}}>
          <View style={styles.background}>
           <View style={{alignItems: 'center', marginTop: 40}}>
             <Image
              style={{width: 198/3, height: 151/3}}
              source={require('../Images/golockerLogo.png')}
             />
             <Text style={{textAlign: 'center', fontSize: 28, color: Colors.dark_gray, marginTop: 30}}>{headerText}</Text>
           </View>
            <View style={styles.container}>
                <TextInput underlineColorAndroid='transparent' ref="usernameField"  placeholderTextColor={Colors.tapable_blue} style={{color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, textAlign: 'center', fontFamily: Theme.primaryFont}} placeholder={"Email / Mobile Number"} onChangeText={(username) => this.setState({username})} value={this.state.username}/>
                <TextInput underlineColorAndroid='transparent' ref="passwordField" secureTextEntry={true} placeholderTextColor={Colors.tapable_blue} style={{color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, textAlign: 'center', fontFamily: Theme.primaryFont, marginTop: 5}} placeholder={"Password"} onChangeText={(password) => this.setState({password})} value={this.state.password}/>
                <TouchableHighlight onPress={this.onLoginPress} underlayColor={'transparent'}>
                  <View style={{height: 50, borderRadius: 4, backgroundColor: this.state.signInColor, marginTop: 10}}>
                    <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>{this.state.signInText}</Text>
                  </View>
                </TouchableHighlight>
                {showTouchIdSwitch &&
                <View style={{marginBottom: 20, flex: 1, flexDirection: 'row', marginTop: 15}}>
                  <Text style={{flex: 2, fontSize: 20, color: Colors.gray_85}}>Enable Touch/Face ID</Text>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Switch trackColor={Colors.light_green} value={touchIDSwitchEnabled} onValueChange={(value) => {
                      if(!value) {
                        Keychain.resetGenericPassword()
                        .then(() => {

                        })
                        .catch(err => {

                        })
                      }

                      this.setState({touchIDSwitchEnabled: value})
                    }}/>
                  </View>
                </View>
                }
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
