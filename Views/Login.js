import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Dimensions, StatusBar, Image, TextInput, Alert} from 'react-native';
import { Theme } from '../Common/Theme'
import { Colors } from '../Common/Colors'
import { Storage } from '../Common/Storage'

const Label = (props) => {
    return (
        <Text
            style={props.styles && props.styles.textLabel ? props.styles.textLabel : styles.textLabel}>
            {props.text}
        </Text>
    );
}

export class LoginView extends Component {
  static navigationOptions = { title: 'Login', header: null };
  constructor(props) {
   super(props);

   this.state = {
     username: null,
     password: null
   };
  }

  onButtonPress = () => {
    const username = this.state.username
    const password = this.state.password
    Authentication.login(username, password)
    .then(data => {
    })
    .catch(err => {
      Alert.alert('', "Whoops! This email address and password combination doesn't exist",[{text: 'OK', onPress: () => {}}],{ cancelable: false })
    })
  }

  render() {
    return (
      <View style={styles.background}>
        <StatusBar
        barStyle="light-content"
       />
       <View style={{alignItems: 'center'}}>
         <Image
          style={{width: 66, height: 50}}
          source={require('../Images/go-locker-brand.png')}
         />
       </View>

        <View style={styles.container}>
          <TextInput style={styles.emailTextInput} placeholder="Email Address or Mobile Phone" onChangeText={(username) => this.setState({username})} value={this.state.username}/>
          <TextInput style={styles.passwordTextInput} placeholder="Enter Password" secureTextEntry={true} onChangeText={(password) => this.setState({password})} value={this.state.password}/>
          <Button style={styles.loginButton} color={Colors.white} title="Login" onPress={this.onButtonPress}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Theme.primaryColor,
    paddingTop: 50,
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
    borderBottomWidth: 1,
    borderColor: Colors.white
  },
  passwordTextInput: {
    height: 50,
    fontSize: 18,
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
    height: 100
  }
});
