import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Alert, Image, TouchableHighlight, SafeAreaView} from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import FlatButton  from '../Elements/FlatButton'
import PropertyService from '../Services/PropertyService'
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';

export default class NoAvailableLockers extends Component {
  constructor(props) {
   super(props);

   this.state = {
     email: null
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

  static navigationOptions = { header: null };
  render() {
    const text = "Unfortunately we currently don't have any lockers in your area. Enter your email address below so we can let you know when one becomes available. We'll only use it to tell you when service becomes available."
    var errorText = this.state.errorMessage ? <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>{this.state.errorMessage}</Text> : null

    if(!errorText && this.state.error ) {
      errorText = <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>Something is wrong. Please try again</Text>
    }

    return (
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
            <TouchableHighlight onPress={() => {this.onLoginPress()}} underlayColor={'transparent'}>
              <SafeAreaView style={{marginTop: 35, marginRight: 20}}>
                <Text style={{textAlign: 'right', color: Colors.gray_85, fontSize: 16, zIndex: 1}}>Sign in</Text>
              </SafeAreaView>
            </TouchableHighlight>
              <View style={{marginTop: 30}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Sorry</Text>
              {errorText}
              <View style={{marginTop: 20}}>
                <Text style={{marginLeft: 21, marginRight: 21,marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>{text}</Text>
              </View>
              <View style={{marginLeft: 21, marginRight: 21}}>
                <TextInput underlineColorAndroid='transparent' ref="emailField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, marginRight: 5,paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Enter Email"} onChangeText={(email) => this.setState({email})} value={this.state.email}/>
                <TouchableHighlight onPress={() => {this.onCheckPress()}} underlayColor={'transparent'}>
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
