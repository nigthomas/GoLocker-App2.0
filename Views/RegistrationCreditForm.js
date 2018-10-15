import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Alert, Image, TouchableHighlight, FlatList, Switch, SafeAreaView, Platform} from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import FlatButton  from '../Elements/FlatButton'
import PropertyService from '../Services/PropertyService'
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';
import MapView from 'react-native-maps';
import LoginService from '../Services/LoginService'
import Utils from '../Common/Utils'
import PhoneInput from 'react-native-phone-input'
import ThreeHeaderView from '../Elements/ThreeHeaderView'
import NativeStatusBar from '../Elements/NativeStatusBar'
import Entypo from 'react-native-vector-icons/dist/Entypo'

export default class RegistrationCreditForm extends Component {
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
     errorMessage: null,
     creditCardNumber: null,

     creditCardMonth: null,
     creditCardYear: null,
     creditCardCVV: null,
     creditCardZipCode: null,
     selectedPlan: "Pay-Per-Package",
     promoCode: null,
     sending: false
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
    const number = this.state.phone
    const email = this.state.email
    const password = this.state.password
    const passwordConfirmation = this.state.passwordConfirmation
    const handicap = this.state.handicap
    const locker = (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) ? this.props.navigation.state.params.property : {}
    const { navigation } = this.props;
    const passwordsMatch = password && password.length > 0 && passwordConfirmation === password
    const isComplexPassword = Utils.isPasswordComplex(password)
    const countryCode = this.countryCode.getValue().replace("+", "")
    const completePhoneNumber = countryCode == "1" ? number : (countryCode + number)
    const creditCardNumber = this.state.creditCardNumber

    const creditCardMonth = this.state.creditCardMonth
    const creditCardYear = this.state.creditCardYear
    const creditCardCVV = this.state.creditCardCVV
    const postalCode = this.state.creditCardZipCode
    const card = {number: creditCardNumber, month: creditCardMonth, year: creditCardYear, cvc: creditCardCVV}

    const promoCode = this.state.promoCode
    const plan = this.state.selectedPlan

    if(this.state.sending) {
      return;
    }

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

    if(!number) {
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

    if(!creditCardNumber || !creditCardNumber.length >= 14) {
      this.setState({errorMessage: "Please enter valid credit card number"})
      this.component._root.scrollToPosition(0, 0)
      return
    }

    if(!creditCardMonth) {
      this.setState({errorMessage: "Please enter valid credit card month"})
      this.component._root.scrollToPosition(0, 0)
      return
    }

    if(!creditCardYear) {
      this.setState({errorMessage: "Please enter valid credit card year"})
      this.component._root.scrollToPosition(0, 0)
      return
    }

    if(!creditCardYear) {
      this.setState({errorMessage: "Please enter valid credit card cvv"})
      this.component._root.scrollToPosition(0, 0)
      return
    }

    if(!postalCode) {
      this.setState({errorMessage: "Please enter valid billing zip code"})
      this.component._root.scrollToPosition(0, 0)
      return
    }

    this.setState({sending: true})

    LoginService.getInstance().registerUser(firstName, lastName, email.trim(), completePhoneNumber, password, locker.id, handicap, null, plan, card, postalCode, promoCode)
    .then(() => {
      this.setState({errorMessage: null, sending: false})
      navigation.navigate('Verification', {email: email.trim(), firstName: firstName})
    })
    .catch(err => {
      var title = err.title || "Something is wrong. Try again later.";
      title = title.endsWith(".") ? title : title + "."

      var details = err.details || []
      details.forEach((detail) => {
        detail = detail.endsWith(".") ? detail : detail + ".";
      })

      const errorMessage = title + " " + details.join(" ");
      this.setState({errorMessage: errorMessage, sending: false})
      this.component._root.scrollToPosition(0, 0)
    })
  }

  showChangePlan(currentPlan) {
    const { navigation } = this.props;
    navigation.navigate('SelectPlan', {selectedPlan: currentPlan, onSelect: (options) => {this.onPlanSelect(options)}})
  }

  onPlanSelect(options) {
    this.setState({selectedPlan: options.selectedPlan, promoCode: options.code})
    this.component._root.scrollToEnd()
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

  onBackPress() {
    this.props.navigation.goBack()
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
        <NativeStatusBar/>
          <Content style={{backgroundColor: Colors.white}} ref={c => (this.component = c)}>
              <SafeAreaView style={{marginTop: 20}}>
                <ThreeHeaderView title={""} leftButtonTitle={"Back"} rightButtonTitle={"Sign in"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onLoginPress()}}/>
              </SafeAreaView>
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
               <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <View style={{flex: 2, paddingTop: 23}}>
                    <PhoneInput ref={(ref) => { this.countryCode = ref; }} value={this.state.countryCode}/>
                  </View>
                  <TextInput underlineColorAndroid='transparent' ref="phoneField" keyboardType='numeric' placeholderTextColor={Colors.tapable_blue} style={{flex: 5, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Phone"} onChangeText={(phone) => this.setState({phone})} value={this.state.phone}/>
               </View>
               <TextInput underlineColorAndroid='transparent' ref="emailField" keyboardType='email-address' placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Email"} onChangeText={(email) => this.setState({email})} value={this.state.email}/>

               <TextInput underlineColorAndroid='transparent' ref="passwordField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Password"} onChangeText={(password) => this.setState({password})} value={this.state.password}/>
               <TextInput underlineColorAndroid='transparent' ref="passwordConfirmationField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Password Confirmation"} onChangeText={(passwordConfirmation) => this.setState({passwordConfirmation})} value={this.state.passwordConfirmation}/>
               <Text style={{textAlign: 'left', color: Colors.dark_gray, fontSize: 10, marginTop: 5}}>*Password must be at least 8 characters, have 1 number and 1 uppercase character.</Text>

               <View style={{flex: 1, flexDirection:'row',  marginTop: 10}}>
                 <TextInput underlineColorAndroid='transparent' ref="creditCardNumberField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, marginRight: 5, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Credit Card No."} onChangeText={(creditCardNumber) => this.setState({creditCardNumber})} value={this.state.creditCardNumber}/>
               </View>

               <View style={{flex: 1, flexDirection:'row',  marginTop: 10}}>
                 <TextInput underlineColorAndroid='transparent' ref="creditCardMonthField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, marginRight: 5, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"MM"} onChangeText={(creditCardMonth) => this.setState({creditCardMonth})} value={this.state.creditCardMonth}/>
                 <TextInput underlineColorAndroid='transparent' ref="creditCardYearField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, marginRight: 5, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"YYYY"} onChangeText={(creditCardYear) => this.setState({creditCardYear})} value={this.state.creditCardYear}/>
               </View>

               <View style={{flex: 1, flexDirection:'row',  marginTop: 10}}>
                 <TextInput underlineColorAndroid='transparent' ref="creditCardCVVField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, marginRight: 5, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"CVV"} onChangeText={(creditCardCVV) => this.setState({creditCardCVV})} value={this.state.creditCardCVV}/>
                 <TextInput underlineColorAndroid='transparent' ref="creditCardBillingZipField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, marginRight: 5, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Billing Zip Code"} onChangeText={(creditCardZipCode) => this.setState({creditCardZipCode})} value={this.state.creditCardZipCode}/>
               </View>

               <View style={{marginTop: 15, height: 50, flex: 1}}>
                <TouchableHighlight onPress={() => {this.showChangePlan(this.state.selectedPlan)}} underlayColor={'transparent'}>
                  <View>
                    <Text style={{fontSize: 14, color: Colors.gray_85, fontWeight: '600', marginTop: Platform.OS === 'ios' ? 10 : 7}}>
                      Choose a plan
                    </Text>

                    <View style={{position: 'absolute', right: 0, flex: 1, flexDirection:'row', zIndex: -1}}>
                      <Text style={{color: Theme.primaryColor, marginTop: Platform.OS === 'ios' ? 10 : 7}}>{this.state.selectedPlan}</Text>
                      <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, marginTop: 5}}/>
                    </View>
                  </View>
                </TouchableHighlight>
              </View>

               <View style={{marginTop: 10, flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                 <Switch onValueChange={(value) => {this.onSwitchChange(value)}} value={this.state.handicap}/>
                 <Text style={{marginLeft: 5, textAlign: 'left', color: Colors.dark_gray, fontWeight: 'bold'}}>Disability</Text>
               </View>
               <Text style={{textAlign: 'left', color: Colors.dark_gray, fontSize: 10, marginTop: 5}}>*Packages for users with physical disabilities will be placed in lower compartments</Text>

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
