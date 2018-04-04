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

  componentDidMount() {
    setTimeout(() => {
      this.refs.firstNameField.focus()
    }, 2000)
  }

  onLoginPress() {
    const { navigation } = this.props;
    navigation.popToTop()
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
      <TouchableHighlight onPress={() => {this.onPropertyPress(property)}} underlayColor={'transparent'}>
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
              </View>
              <Text style={{fontSize: 14, color: Colors.gray_85, marginTop: 10}}>{address}</Text>
              <Text style={{fontSize: 14, color: Colors.gray_85}}>{city}, {state}, {zip}</Text>
            </View>
        </View>
      </TouchableHighlight>
      )
  }

  onCreateAccountPress() {

  }

  render() {
    const locker = (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) ? this.props.navigation.state.params.property : {}
    const headerText = "You're"
    const text = "almost done!"
    const lockerData = this.renderItem(locker)
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

             <View style={{marginTop: 20, marginLeft: 21, marginRight: 21}}>
                <Text style={{marginTop: 5, marginBottom: 10, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>Primary Locker</Text>
                {lockerData}
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

               <TouchableHighlight onPress={() => {this.onCreateAccountPress()}} underlayColor={'transparent'}>
                 <View style={{height: 50, borderRadius: 4, backgroundColor: Colors.light_green, marginTop: 10, marginBottom: 30}}>
                   <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>Create Account</Text>
                 </View>
               </TouchableHighlight>
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
