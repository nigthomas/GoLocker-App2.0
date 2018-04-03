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

export default class UpdatePhone extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   this.state = {
     phone: null
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
            <ThreeHeaderView title={"Phone"} leftButtonTitle={"Back"} rightButtonTitle={"Save"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onSavePress()}}/>
          </View>
          <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, height: 50, flex: 1}}>
            <View style={{flexDirection:'row', flexWrap:'wrap'}}>
              <Text style={{textAlign: 'center', fontSize: 15, color: Colors.dark_gray, height: 50, lineHeight: 50, backgroundColor: Colors.gray_f3, width: 100}}>
                US +1
              </Text>
              <TextInput underlineColorAndroid='transparent' placeholderTextColor={Colors.dark_gray} keyboardType='numeric' style={{flex: 1, paddingLeft: 21, color: Colors.dark_gray, backgroundColor: Colors.white, height: 50, fontFamily: Theme.primaryFont, borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1}} placeholder={"Phone Number"} onChangeText={(phone) => this.setState({phone})} value={this.state.phone}/>
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
