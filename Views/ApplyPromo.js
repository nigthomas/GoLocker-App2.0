import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TextInput, TouchableHighlight, SafeAreaView} from 'react-native';
import Theme from '../Common/Theme'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, Root, Right} from 'native-base';
import AccountService from '../Services/AccountService'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'
import HeaderView from '../Elements/HeaderView'
import Utils from '../Common/Utils'
import ThreeHeaderView from '../Elements/ThreeHeaderView'
import NativeStatusBar from '../Elements/NativeStatusBar'

export default class ApplyPromo extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);
   this.state = {
     code: null,
     buttonColor: Colors.light_green,
     buttonText: "Apply",
     errorText: null,
     applying: false
   };
  }

  onApplyPress() {
    if(this.state.applying) {
      return;
    }

    const code = this.state.code

    if(!Utils.ifDefNN(code)) {
      this.setState({errorText: "Please enter code to continue"})
      return
    }

    this.setState({errorText: null})
    this.showProcessingState()

    AccountService.getInstance().applyPromoCode(code)
    .then(() => {
      this.setState({buttonText: "Code applied", buttonColor: Colors.gray_85, applying: false})
      setTimeout(() => {
        this.showRegularState()
      }, 750)
    })
    .catch(err => {
      this.showRegularState()
      this.setState({errorText: err.message, applying: false})
    })
  }

  onBackPress() {
    this.props.navigation.goBack()
  }

  showProcessingState() {
    this.setState({buttonText: "Applying...", buttonColor: Colors.gray_85, applying: true})
  }

  showRegularState() {
    this.setState({buttonText: "Apply", buttonColor: Colors.light_green, applying: false})
  }

  render() {
    const errorText = this.state.errorText ? <Text style={{marginLeft: 21, color: Colors.red, marginTop: 5}}>{this.state.errorText}</Text> : null
    const buttonText = this.state.buttonText
    return (
      <Root>
        <Container>
          <NativeStatusBar/>
          <Content style={{backgroundColor: Colors.white}}>
          <SafeAreaView style={{marginTop: 20}}>
            <ThreeHeaderView title={"Apply Code"} leftButtonTitle={"Back"} rightButtonTitle={"Apply"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onApplyPress()}}/>
          </SafeAreaView>
          {errorText}

          <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color:  this.state.enterTrackingNumberError ? Colors.red : Colors.gray_85, fontWeight: 'bold'}}>Promo Code</Text>
          <View style={{marginLeft: 21, marginTop: 15, marginRight: 21}}>
            <TextInput underlineColorAndroid='transparent' placeholderTextColor={Colors.gray_85} style={{color: Colors.dark_gray, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont, paddingLeft: 10}} placeholder={"Enter Promo Code"} onChangeText={(code) => this.setState({code})} value={this.state.code}/>
          </View>

          <TouchableHighlight onPress={() => {this.onApplyPress()}} underlayColor={'transparent'}>
            <View style={{height: 50, borderRadius: 4, backgroundColor: this.state.buttonColor, marginLeft: 21, marginTop: 25, marginRight: 21}}>
              <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>{buttonText}</Text>
            </View>
          </TouchableHighlight>
          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"details"}/>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.primaryColor
  },
});
