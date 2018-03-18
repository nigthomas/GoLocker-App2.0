import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Dimensions, StatusBar, Image, TextInput, Alert, TouchableHighlight, Platform} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import Storage from '../Common/Storage'
import LoginService from '../Services/LoginService'
import FlatButton from '../Elements/FlatButton'
import AlertView from '../Elements/AlertView'
import { Toast } from 'native-base';

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

    LoginService.login(username, password)
    .then(account => {
      const { navigate }  = this.props.rootNavigation.navigate;
      navigate('DashboardView', {navigate: navigate})
    })
    .catch(err => {
      AlertView.showConfirmation("Whoops! This username and password combination doesn't exist")
    })
  }

  onRegisterPress = () => {
    const { navigate } = this.props.rootNavigation.navigate;
    navigate('RegistrationView', {navigation: this.props.rootNavigation.navigate})
  }

  render() {
    var width = Dimensions.get('window').width;

    return (
      <Root>
        <View style={styles.background}>
         <View style={{alignItems: 'center'}}>
           <Image
            style={{width: 66, height: 50}}
            source={require('../Images/go-locker-brand.png')}
           />
         </View>
          <View style={styles.container}>
            <Item floatingLabel style={{marginTop: 10, height: 60}}>
             <Label style={{marginTop: Platform.OS === 'ios' ? -5:0, fontFamily: Theme.primaryFont}}>Email Address or Mobile Phone</Label>
             <Input style={{color: Colors.white, fontFamily: Theme.primaryFont}} onChangeText={(username) => this.setState({username})} value={this.state.username}/>
            </Item>

            <Item floatingLabel style={{marginTop: 15, height: 60}}>
              <Label style={{marginTop: Platform.OS === 'ios' ? -5:0, fontFamily: Theme.primaryFont}}>Password</Label>
              <Input style={{color: Colors.white, fontFamily: Theme.primaryFont}} secureTextEntry={true} onChangeText={(password) => this.setState({password})} value={this.state.password} />
             </Item>

            <View style={{flex: 1, marginTop: 25}}>
              <FlatButton style={{backgroundColor: 'transparent'}} onPress={this.onLoginPress} title={"Sign In"}/>
              <FlatButton style={{marginTop: 10, backgroundColor: 'transparent'}} borderColor={Theme.primaryColor} fontSize={14} onPress={this.onRegisterPress} title={"Register"}/>
            </View>
          </View>
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Theme.primaryColor,
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 50,
  },
  container: {
    flex: 1,
    marginTop: 50,
    paddingTop: 10
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
