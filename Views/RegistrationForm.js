import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Alert, Image, TouchableHighlight, FlatList, Switch, SafeAreaView} from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import FlatButton  from '../Elements/FlatButton'
import PropertyService from '../Services/PropertyService'
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';
import MapView from 'react-native-maps';
import LoginService from '../Services/LoginService'
import Utils from '../Common/Utils'

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
     passwordConfirmation: null,
     handicap: false,
     errorMessage: null
   }
  }

  componentDidMount() {
    setTimeout(() => {
      if(this.refs.firstNameField) {
        this.refs.firstNameField.focus()
      }
    }, 1500)
  }

  onLoginPress() {
    const { navigation } = this.props;
    navigation.popToTop()
  }

  onChange() {
    const { navigation } = this.props;
    navigation.goBack()
  }

  onCreateAccountPress() {
    const firstName = this.state.firstName
    const lastName = this.state.lastName
    const phone = this.state.phone
    const email = this.state.email
    const password = this.state.password
    const passwordConfirmation = this.state.passwordConfirmation
    const handicap = this.state.handicap
    const locker = (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) ? this.props.navigation.state.params.property : {}
    const { navigation } = this.props;
    const passwordsMatch = password && password.length > 0 && passwordConfirmation === password
    const isComplexPassword = Utils.isPasswordComplex(password)

    if(!firstName) {
      this.setState({errorMessage: "Please enter your first name"})
      this.component._root.scrollToPosition(0, 0)
      return
    }

    if(!lastName) {
      this.setState({errorMessage: "Please enter your last name"})
      this.component._root.scrollToPosition(0, 0)
      return
    }

    if(!phone) {
      this.setState({errorMessage: "Please enter your phone number"})
      this.component._root.scrollToPosition(0, 0)
      return
    }

    if(!email || !Utils.validateEmail(email)) {
      this.setState({errorMessage: "Please enter a valid email"})
      this.component._root.scrollToPosition(0, 0)
      return
    }

    if(!password) {
      this.setState({errorMessage: "Please enter a password"})
      this.component._root.scrollToPosition(0, 0)
      return
    }

    if(!passwordConfirmation) {
      this.setState({errorMessage: "Please confirm your password"})
      this.component._root.scrollToPosition(0, 0)
      return
    }

    if(!passwordsMatch) {
      this.setState({errorMessage: "Passwords don't match"})
      this.component._root.scrollToPosition(0, 0)
      return
    }

    if(!isComplexPassword) {
      this.setState({errorMessage: "Password is too weak or contains invalid characters"})
      this.component._root.scrollToPosition(0, 0)
      return
    }

    LoginService.getInstance().registerUser(firstName, lastName, email, phone, password, locker.id, handicap)
    .then(() => {
      navigation.navigate('Verification', {email: email.trim(), firstName: firstName})
    })
    .catch(err => {
      this.setState({errorMessage: "Something is wrong or your phone number or email is in use"})
      this.component._root.scrollToPosition(0, 0)
    })
  }

  renderItem(property) {
    if(!property) {
      return (<View></View>)
    }

    const location = (property.location) ? property.location : null
    const name = property.name
    const address = property.address
    const city = property.city
    const state = property.stateProvince
    const zip = property.postalCode

    if(!location) {
      return (
        <View></View>
      )
    }

    return (
        <View style={{flex: 1, marginBottom: 30}}>
          <View style={{flex: 1}}>
            <MapView
              style={{flex: 1, height: 200, borderRadius: 4}}
              scrollEnabled={false}
              initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0222,
              longitudeDelta: 0.0221,
              }}
              />
            </View>
            <View>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={{fontSize: 16, color: Colors.dark_gray, marginTop: 10, fontWeight: '600', flex: 2}}>{name}</Text>
                <TouchableHighlight onPress={() => {this.onChange()}} underlayColor={'transparent'}>
                  <Text style={{fontSize: 12, color: Colors.gray_85, marginTop: 13, flex: 1, textAlign: 'right'}}>CHANGE</Text>
                </TouchableHighlight>
              </View>
              <Text style={{fontSize: 14, color: Colors.gray_85, marginTop: 10}}>{address}</Text>
              <Text style={{fontSize: 14, color: Colors.gray_85}}>{city}, {state}, {zip}</Text>
            </View>
        </View>
      )
  }

  onSwitchChange(value) {
    this.setState({handicap: value})
  }

  render() {
    const locker = (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) ? this.props.navigation.state.params.property : {}
    const headerText = "You're"
    const text = "almost done!"
    const lockerData = this.renderItem(locker)
    var errorText = this.state.errorMessage ? <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>{this.state.errorMessage}</Text> : null

    if(!errorText && this.state.error ) {
      errorText = <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>Something is wrong. Please try again</Text>
    }

    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}} ref={c => (this.component = c)}>
            <TouchableHighlight onPress={() => {this.onLoginPress()}} underlayColor={'transparent'}>
              <SafeAreaView style={{marginTop: 35, marginRight: 20}}>
                <Text style={{textAlign: 'right', color: Colors.gray_85, fontSize: 16, zIndex: 1}}>Sign in</Text>
              </SafeAreaView>
            </TouchableHighlight>
              <View style={{marginTop: 30}}>
                <Text style={{marginLeft: 21, marginTop: 20, fontSize: 36, color: Colors.dark_gray, fontWeight: 'bold'}}>{headerText}</Text>
                <Text style={{marginLeft: 21, fontSize: 36, color: Colors.dark_gray, fontWeight: 'bold'}}>{text}</Text>
                {errorText}
             </View>

             <View style={{marginTop: 20, marginLeft: 21, marginRight: 21}}>
                <Text style={{marginTop: 5, marginBottom: 10, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>Primary Locker</Text>
                {lockerData}
             </View>


             <View style={{marginLeft: 21, marginRight: 21, marginTop: 10}}>
               <View style={{flex: 1, flexDirection:'row'}}>
                 <TextInput underlineColorAndroid='transparent' ref="firstNameField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, marginRight: 5, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"First Name"} onChangeText={(firstName) => this.setState({firstName})} value={this.state.firstName}/>
                 <TextInput underlineColorAndroid='transparent' ref="lastNameField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, marginLeft: 5, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Last Name"} onChangeText={(lastName) => this.setState({lastName})} value={this.state.lastName}/>
               </View>
               <TextInput underlineColorAndroid='transparent' ref="phoneField" keyboardType='numeric' placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Phone"} onChangeText={(phone) => this.setState({phone})} value={this.state.phone}/>
               <TextInput underlineColorAndroid='transparent' ref="emailField" keyboardType='email-address' placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Email"} onChangeText={(email) => this.setState({email})} value={this.state.email}/>

               <TextInput underlineColorAndroid='transparent' ref="passwordField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Password"} onChangeText={(password) => this.setState({password})} value={this.state.password}/>
               <TextInput underlineColorAndroid='transparent' ref="passwordConfirmationField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Password Confirmation"} onChangeText={(passwordConfirmation) => this.setState({passwordConfirmation})} value={this.state.passwordConfirmation}/>
               <View style={{marginTop: 10, flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                 <Switch onValueChange={(value) => {this.onSwitchChange(value)}} value={this.state.handicap}/>
                 <Text style={{marginLeft: 5, textAlign: 'left', color: Colors.dark_gray, fontWeight: 'bold'}}>Disability</Text>
               </View>
               <Text style={{textAlign: 'left', color: Colors.dark_gray, fontSize: 10, marginTop: 5}}>*Packages for users with physical disabilities will be placed in lower compartments)</Text>
               <TouchableHighlight onPress={() => {this.onCreateAccountPress()}} underlayColor={'transparent'}>
                 <View style={{height: 50, borderRadius: 4, backgroundColor: Colors.light_green, marginTop: 20, marginBottom: 30}}>
                   <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>Create Account</Text>
                 </View>
               </TouchableHighlight>
             </View>

          </Content>
        </Container>
      </Root>
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
