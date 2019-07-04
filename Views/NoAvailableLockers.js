import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Alert, Image, TouchableHighlight, SafeAreaView} from 'react-native';
import Theme from '../Common/Theme'
import Utils from '../Common/Utils'
import Colors from '../Common/Colors'
import FlatButton  from '../Elements/FlatButton'
import PropertyService from '../Services/PropertyService'
import NewsletterService from '../Services/NewsletterService'
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';
import NativeStatusBar from '../Elements/NativeStatusBar'
import ThreeHeaderView from '../Elements/ThreeHeaderView'
import firebase from 'react-native-firebase';

export default class NoAvailableLockers extends Component {
  constructor(props) {
   super(props);

   const { params } = this.props.navigation.state;
   const zip_code = params.zip_code

   this.state = {
     email: null,
     zip_code: zip_code
   }
  }

  onLoginPress = () => {
    const { navigation } = this.props;
    navigation.popToTop()
  }

  onTryAgain = () => {
    const { navigation } = this.props;
    navigation.goBack()
  }

  onBackPress() {
    this.props.navigation.goBack()
  }

  onSavePress() {
    const email = this.state.email
    if (!Utils.validateEmail(email)) {
      this.setState({errorMessage: "Invalid email address"})
      return;
    }

    const ref = firebase.firestore().collection('crm')
    , zip_code = this.state.zip_code
    ;

    ref.doc().set({email: email, zip_code})
    .then(transaction => {
      return NewsletterService.addEmail(email)
    })
    .then(() => {
      Alert.alert("Success", "Email added",[{text: 'OK', onPress: () => {
        const { navigation } = this.props;
        navigation.popToTop()
      }}], { cancelable: true })
    })
    .catch(err => {
      console.log(err)
      this.setState({errorMessage: "An error occurred while saving your email"})
    })

  }

  static navigationOptions = { header: null };
  render() {
    const text = "Unfortunately we currently don't have any lockers in your area. Enter your email address below so we can let you know when one becomes available. We'll only use it to tell you when service becomes available."
    var errorText = this.state.errorMessage ? <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>{this.state.errorMessage}</Text> : null

    if(!errorText && this.state.error) {
      errorText = <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>Something is wrong. Please try again</Text>
    }

    return (
        <Container>
        <NativeStatusBar/>
          <Content style={{backgroundColor: Colors.white}}>
              <SafeAreaView style={{marginTop: 20}}>
                <ThreeHeaderView title={""} leftButtonTitle={"Back"} rightButtonTitle={"Sign in"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onLoginPress()}}/>
              </SafeAreaView>
              <View style={{marginTop: 30}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Sorry</Text>
              {errorText}
              <View style={{marginTop: 20}}>
                <Text style={{marginLeft: 21, marginRight: 21,marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>{text}</Text>
              </View>
              <View style={{marginLeft: 21, marginRight: 21}}>
                <TextInput underlineColorAndroid='transparent' ref="emailField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, marginRight: 5,paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Enter Email"} onChangeText={(email) => this.setState({email})} value={this.state.email}/>
                <TouchableHighlight onPress={() => {this.onSavePress()}} underlayColor={'transparent'}>
                  <View style={{height: 50, borderRadius: 4, backgroundColor: Colors.light_green, marginTop: 10}}>
                    <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>Save</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {this.onTryAgain()} } underlayColor={'transparent'}>
                  <View>
                    <Text style={{textAlign: 'center', color: Colors.tapable_blue, marginTop: 20}}>Try a different ZIP Code</Text>
                  </View>
                </TouchableHighlight>
              </View>
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
