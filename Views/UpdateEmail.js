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
import Entypo from 'react-native-vector-icons/dist/Entypo'
import ThreeHeaderView from '../Elements/ThreeHeaderView'

export default class UpdateEmail extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   this.state = {
     email: null
   };
  }

  onSavePress() {

  }

  onBackPress() {
    this.props.navigation.goBack()
  }

  render() {
    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
          <View style={{marginTop: 40}}>
            <ThreeHeaderView title={"Email"} leftButtonTitle={"Back"} rightButtonTitle={"Save"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onSavePress()}}/>
          </View>
          <View style={{justifyContent: 'center', height: 50, flex: 1}}>
            <View style={{flexDirection:'row', flexWrap:'wrap'}}>
              <TextInput underlineColorAndroid='transparent' placeholderTextColor={Colors.dark_gray} keyboardType='numeric' style={{borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, flex: 1, paddingLeft: 21, color: Colors.dark_gray, backgroundColor: Colors.white, height: 50, fontFamily: Theme.primaryFont}} placeholder={"Email"} onChangeText={(email) => this.setState({email})} value={this.state.email}/>
            </View>
          </View>

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
