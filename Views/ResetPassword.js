import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Dimensions, StatusBar, Image, TextInput, Alert, TouchableHighlight, Platform, SafeAreaView} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import Storage from '../Common/Storage'
import LoginService from '../Services/LoginService'
import FlatButton from '../Elements/FlatButton'
import AlertView from '../Elements/AlertView'
import NativeStatusBar from '../Elements/NativeStatusBar'

export default class ResetPassword extends Component {

  constructor(props) {
   super(props);

   this.state = {
     username: null
   };
  }

  render() {
    const style = this.props.style || {}
    style.justifyContent = 'center'
    style.flex = 1

    return (
      <Root>
      <Container>
      <NativeStatusBar/>
        <View style={styles.background}>
         <SafeAreaView style={{marginTop: 100}}>
           <Text style={{textAlign: 'center', fontSize: 28, color: Colors.dark_gray, marginTop: 25}}>Reset Password</Text>
           <TextInput placeholderTextColor={Colors.tapable_blue} style={{color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, textAlign: 'center', fontFamily: Theme.primaryFont, marginTop: 25}} placeholder={"New Password"} onChangeText={(username) => this.setState({username})} value={this.state.username}/>
           <TextInput placeholderTextColor={Colors.tapable_blue} style={{color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, textAlign: 'center', fontFamily: Theme.primaryFont, marginTop: 5}} placeholder={"Confirm New Password"} onChangeText={(username) => this.setState({username})} value={this.state.username}/>

           <View style={{height: 50, borderRadius: 4, backgroundColor: '#7ED321', marginTop: 10}}>
             <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>Set New Password</Text>
           </View>

           <TouchableHighlight onPress={this.goToForgotPassword} underlayColor={'transparent'}>
             <View>
               <Text style={{textAlign: 'center', color: Colors.tapable_blue, marginTop: 20}}>Sign in</Text>
             </View>
           </TouchableHighlight>

         </SafeAreaView>
        </View>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Colors.white,
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 50,
  }
});
