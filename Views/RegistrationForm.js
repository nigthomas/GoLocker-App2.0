import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Alert, Image, TouchableHighlight, FlatList} from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import FlatButton  from '../Elements/FlatButton'
import PropertyService from '../Services/PropertyService'
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';
import MapView from 'react-native-maps';

export default class RegistrationSelectLocker extends Component {
  static navigationOptions = { header: null };

  constructor(props) {
   super(props);

   this.state = {
     firstName: null,
     lastName: null,
     phone: null,
     email: null,
     password: null,
     passwordConfirmation: null
   }
  }

  onLoginPress() {
    const { navigation } = this.props;
    navigation.popToTop()
  }

  render() {
    const headerText = "You're"
    const text = "Almost done!"
    var errorText = this.state.errorMessage ? <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>{this.state.errorMessage}</Text> : null

    if(!errorText && this.state.error ) {
      errorText = <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>An error has occurred. Please try again</Text>
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
             </View>
             <View style={{marginLeft: 21, marginRight: 21, marginTop: 10}}>
               <View style={{flex: 1, flexDirection:'row'}}>
                 <TextInput underlineColorAndroid='transparent' ref="firstNameField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, marginRight: 5, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"First Name"} onChangeText={(firstName) => this.setState({firstName})} value={this.state.firstName}/>
                 <TextInput underlineColorAndroid='transparent' ref="lastNameField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, marginLeft: 5, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Last Name"} onChangeText={(lastName) => this.setState({lastName})} value={this.state.lastName}/>
               </View>
               <TextInput underlineColorAndroid='transparent' ref="phoneField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Phone"} onChangeText={(phone) => this.setState({phone})} value={this.state.phone}/>
               <TextInput underlineColorAndroid='transparent' ref="emailField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Email"} onChangeText={(email) => this.setState({email})} value={this.state.email}/>

               <TextInput underlineColorAndroid='transparent' ref="passwordField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Password"} onChangeText={(password) => this.setState({password})} value={this.state.password}/>
               <TextInput underlineColorAndroid='transparent' ref="passwordConfirmationField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Password Confirmation"} onChangeText={(passwordConfirmation) => this.setState({passwordConfirmation})} value={this.state.passwordConfirmation}/>
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
