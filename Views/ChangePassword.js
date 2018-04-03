import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TextInput, TouchableHighlight} from 'react-native';
import Theme from '../Common/Theme'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, Root, Right} from 'native-base';
import LoadingView from './Loading'
import DashboardService from '../Services/DashboardService'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'
import ClearButton from '../Elements/ClearButton'
import HeaderView from '../Elements/HeaderView'
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import Moment from 'moment'
import Utils from '../Common/Utils'
import Swipeout from 'react-native-swipeout';
import ThreeHeaderView from '../Elements/ThreeHeaderView'
import AccountService from '../Services/AccountService'
import ErrorView from './ErrorView'

export default class ChangePassword extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   this.state = {
     password: null,
     passwordConfirmation: null,
     passwordNoMatchError: false,
     passwordComplexityError: false,
     error: null
   };
  }

  onSavePress() {
    const passwordsMatch = this.state.password && this.state.password.length > 0 && this.state.passwordConfirmation === this.state.password
    const isComplexPassword = (this.state.password && this.state.password.length >= 8 && //Is >=8 characters
      this.state.password != this.state.password.toLowerCase() && //Has uppercase character
      /\d/.test(this.state.password) &&  //Has numbers
      !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(this.state.password)) //Doesn't have special characters

    if(!passwordsMatch) {
      this.setState({passwordNoMatchError: true, passwordComplexityError: false})
      return
    }

    if(!isComplexPassword) {
      this.setState({passwordNoMatchError: false, passwordComplexityError: true})
      return
    }

    AccountService.getInstance().updatePassword(this.state.password)
    .then(() => {
      this.setState({passwordNoMatchError: false, passwordComplexityError: false})
      this.props.navigation.goBack()
    })
    .catch(err => {
      this.setState({error: err})
    })
  }

  onBackPress() {
    this.props.navigation.goBack()
  }

  render() {
    if(this.state.error) {
        return <View style={{flex: 1, backgroundColor: Colors.white}}>
                <ErrorView />
                <FooterTabWithNavigation navigation={this.props.navigation} active={"details"}/>
              </View>
    }

    const matchText = "Passwords don't match"
    const complexText = "Password is too weak or contains invalid characters"

    const passwordDoesntMatchText = this.state.passwordNoMatchError ? <Text style={{marginLeft: 21, color: Colors.red, marginTop: 5}}>{matchText}</Text> : null
    const complexityText = this.state.passwordComplexityError ? <Text style={{marginLeft: 21, color: Colors.red, marginTop: 5}}>{complexText}</Text> : null

    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
            <View style={{marginTop: 40}}>
              <ThreeHeaderView title={"Change Password"} leftButtonTitle={"Back"} rightButtonTitle={"Save"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onSavePress()}}/>
            </View>
            <View style={{marginLeft: 21, marginRight: 21, marginTop: 30}}>
              <TextInput underlineColorAndroid='transparent' ref="passwordField" placeholderTextColor={Colors.tapable_blue} style={{paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Password"} onChangeText={(password) => this.setState({password})} value={this.state.password}/>
              <TextInput underlineColorAndroid='transparent' ref="passwordConfirmationField" placeholderTextColor={Colors.tapable_blue} style={{marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Password Confirmation"} onChangeText={(passwordConfirmation) => this.setState({passwordConfirmation})} value={this.state.passwordConfirmation}/>
            </View>
            {passwordDoesntMatchText}
            {complexityText}
            <Text style={{marginTop: 10, fontSize: 10, marginLeft: 21, marginRight: 21}}>*Password must contain at least 8 characters, one uppercase letter and one number. No special characters.</Text>
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
