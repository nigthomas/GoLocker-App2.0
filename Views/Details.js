import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, StatusBar, ScrollView} from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, List, ListItem, Separator, Root} from 'native-base';
import HeaderView from '../Elements/HeaderView'
import LoadingView from './Loading'
import Entypo from 'react-native-vector-icons/dist/Entypo'

export default class DetailsView extends Component {
  static navigationOptions = { title: 'Account', header: null, tabBarVisible: false };

  onLogoutPress = () => {

  }

  constructor(props) {
   super(props);

   this.state = {
     data: {},
     loading: false,
     error: null,
     plan: null
   };
  }

  componentDidMount() {
    this.setState({loading: true})
    this.fetch()
  }

  onPaymentMethod() {
    this.showNewUpdatePaymentMethod()
  }

  onBillingAddress() {
    this.showNewUpdateBillingAddress()
  }

  onMailingAddress() {
    this.showNewUpdateMailingAddress()
  }

  onChangePassword() {
    this.showChangePassword()
  }

  onChangePlan() {
    this.showChangePlan()
  }

  showChangePlan() {
    const { navigate }  = this.props.navigation;
    navigate('ChangePlan', {})
  }

  showChangePassword() {
    const { navigate }  = this.props.navigation;
    navigate('ChangePassword', {})
  }

  showNewUpdateMailingAddress() {
    const { navigate }  = this.props.navigation;
    navigate('NewUpdateMailingAddress', {})
  }

  showNewUpdateBillingAddress() {
    const { navigate }  = this.props.navigation;
    navigate('NewUpdateBillingAddress', {})
  }

  showNewUpdatePaymentMethod() {
    const { navigate }  = this.props.navigation;
    navigate('NewUpdatePaymentMethod', {})
  }

  onEmail() {
    this.showUpdateEmail()
  }

  onPhone() {
    this.showUpdatePhone()
  }

  showUpdateEmail() {
    const { navigate }  = this.props.navigation;
    navigate('UpdateEmail', {})
  }

  showUpdatePhone() {
    const { navigate }  = this.props.navigation;
    navigate('UpdatePhone', {})
  }

  fetch() {
    Promise.all([DashboardService.getInfo()])
    .then(results => {
      this.setState({data: results[0], loading: false, error: null})
    })
    .catch(err => {
      this.setState({error: err, loading: false})
    })
  }

  onLogout() {

  }

  render() {
    if(this.state.loading) {
      return <View style={{flex: 1}}>
              <LoadingView />
              <FooterTabWithNavigation navigation={this.props.navigation} active={"details"}/>
            </View>
    }

    const firstName = this.state.data.firstName
    const lastName = this.state.data.lastName

    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
            <View style={{marginTop: 30}}>
              <HeaderView title={`${Utils.capitalize(firstName)} ${Utils.capitalize(lastName)}`} details={"Show QR code"}/>
            </View>
            <View>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Membership</Text>
              <Text style={{marginLeft: 21, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Details</Text>
            </View>
            <View style={{marginTop: 20}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>Current Plan</Text>
            </View>

            <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, marginTop: 15, height: 50, flex: 1}}>
              <TouchableHighlight onPress={() => {this.showChangePlan()}} underlayColor={'transparent'}>
                <Text style={{fontSize: Utils.normalize(14), color: Theme.primaryColor, marginLeft: 21, fontWeight: '600'}}>
                  Pay-per-package
                </Text>
              </TouchableHighlight>

              <View style={{position: 'absolute', right: 21, flex: 1, flexDirection:'row', zIndex: -1}}>
                <Text style={{color: Colors.gray_85, marginTop: 10}}>Upgrade</Text>
                <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, marginTop: 5}}/>
              </View>
            </View>

            <View style={{marginTop: 20}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>Contact Info</Text>
            </View>

            <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, marginTop: 15, height: 50, flex: 1}}>
              <TouchableHighlight onPress={() => {this.onEmail()}} underlayColor={'transparent'}>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <Text style={{fontSize: Utils.normalize(14), color: Colors.gray_85, marginLeft: 21, width: 50}}>
                    Email
                  </Text>
                  <Text style={{fontSize: Utils.normalize(14), color: Colors.gray_47, marginLeft: 21}}>
                    louis.f.ellis@gmail.com
                  </Text>
                </View>
              </TouchableHighlight>
              <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 21}}/>
            </View>

            <View style={{justifyContent: 'center', borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, height: 50, flex: 1}}>
              <TouchableHighlight onPress={() => {this.onPhone()}} underlayColor={'transparent'}>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <Text style={{fontSize: Utils.normalize(14), color: Colors.gray_85, marginLeft: 21, width: 50}}>
                    Phone
                  </Text>
                  <Text style={{fontSize: Utils.normalize(14), color: Colors.gray_47, marginLeft: 21}}>
                    (203) 583-6765
                  </Text>
                </View>
              </TouchableHighlight>
              <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 21}}/>
            </View>

            <View style={{marginTop: 20}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>Billing Details</Text>
            </View>

            <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, height: 50, flex: 1, marginTop: 20}}>
              <TouchableHighlight onPress={() => {this.onPaymentMethod()}} underlayColor={'transparent'}>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <Text style={{fontSize: Utils.normalize(14), color: Colors.gray_85, marginLeft: 21}}>
                    Payment Info
                  </Text>
                </View>
              </TouchableHighlight>
              <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 21}}/>
            </View>

            <View style={{justifyContent: 'center', borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, height: 50, flex: 1}}>
              <TouchableHighlight onPress={() => {this.onBillingAddress()}} underlayColor={'transparent'}>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <Text style={{fontSize: Utils.normalize(14), color: Colors.gray_85, marginLeft: 21}}>
                    Billing Address
                  </Text>
                </View>
              </TouchableHighlight>
              <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 21}}/>
            </View>

            <View style={{justifyContent: 'center', borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, height: 50, flex: 1}}>
              <TouchableHighlight onPress={() => {this.onMailingAddress()}} underlayColor={'transparent'}>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <Text style={{fontSize: Utils.normalize(14), color: Colors.gray_85, marginLeft: 21}}>
                    Mailing Address
                  </Text>
                </View>
              </TouchableHighlight>
              <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 21}}/>
            </View>

            <View style={{marginTop: 20}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>Security</Text>
            </View>

            <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, height: 50, flex: 1, marginTop: 20}}>
              <TouchableHighlight onPress={() => {this.onChangePassword()}} underlayColor={'transparent'}>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <Text style={{fontSize: Utils.normalize(14), color: Colors.gray_85, marginLeft: 21}}>
                    Change Password
                  </Text>
                </View>
              </TouchableHighlight>
              <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 21}}/>
            </View>

            <View style={{marginTop: 20}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>Profile</Text>
            </View>

            <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, marginTop: 20, height: 50, flex: 1, marginTop: 20}}>
              <TouchableHighlight onPress={() => {this.onLogout()}} underlayColor={'transparent'}>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <Text style={{fontSize: Utils.normalize(14), color: Colors.gray_85, marginLeft: 21}}>
                    Logout
                  </Text>
                </View>
              </TouchableHighlight>
              <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 21}}/>
            </View>
          </Content>
          </Container>
        <FooterTabWithNavigation navigation={this.props.navigation} active={"details"}/>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.primaryColor
  },
  itemStyle: {
    height: 45,
    flex: 1,
    marginLeft: 0,
    paddingLeft: 20,
    backgroundColor: Colors.white
  },
  headerStyle: {
    height: 45
  },
  textStyle: {
    fontFamily: Theme.primaryFont
  }
});
