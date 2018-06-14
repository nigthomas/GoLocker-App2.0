import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, StatusBar, ScrollView, Linking, Platform, SafeAreaView} from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, List, ListItem, Separator, Root} from 'native-base';
import HeaderView from '../Elements/HeaderView'
import LoadingView from './Loading'
import Entypo from 'react-native-vector-icons/dist/Entypo'
import LoginService from '../Services/LoginService'
import AccountService from '../Services/AccountService'
import LockerService from '../Services/LockerService'
import NativeStatusBar from '../Elements/NativeStatusBar'

export default class DetailsView extends Component {
  static navigationOptions = { title: 'Account', header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   this.state = {
     data: {},
     loading: false,
     error: null,
     plan: null,
     phone: null,
     email: null,
     plan: null
   };
  }

  componentDidMount() {
    this.setState({loading: true})
    this.fetch()

    LockerService.getInstance().getListener()
    .on("UPDATED", () => {
      this.setState({loading: true})
      this.fetch()
    })

    AccountService.getInstance().getListener()
    .on("UPDATED", () => {
      this.setState({loading: true})
      this.fetch()
    })
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
    const address = this.state.data.mailing
    navigate('NewUpdateMailingAddress', {address: address})
  }

  showNewUpdateBillingAddress() {
    const { navigate }  = this.props.navigation;
    const billing = this.state.data.billing
    navigate('NewUpdateBillingAddress', {address: billing})
  }

  showNewUpdatePaymentMethod() {
    const { navigate }  = this.props.navigation;
    const billing = this.state.data.billing || {}
    navigate('NewUpdatePaymentMethod', {creditCard: billing.creditCard, address: billing})
  }

  showApplyCode() {
    const { navigate }  = this.props.navigation;
    navigate('ApplyPromo', {})
  }

  showLockers() {
    const primaryLocker = this.state.data.primaryLocker
    const secondaryLocker = this.state.data.secondaryLocker
    const lockers = [primaryLocker, secondaryLocker]

    this.showLockersList(lockers)
  }

  onEmail() {
    this.showUpdateEmail()
  }

  onPhone() {
    this.showUpdatePhone()
  }

  onLogout() {
    LoginService.getInstance().logOut()
  }

  onSupport() {
    Linking.openURL('mailto:support@golocker.com?subject=Support%20Needed')
  }

  showUpdateEmail() {
    const { navigate }  = this.props.navigation;
    const email = this.state.data.email
    navigate('UpdateEmail', {email: this.state.data.email})
  }

  showUpdatePhone() {
    const { navigate }  = this.props.navigation;
    const phone = this.state.data.mobilePhone || this.state.data.homePhone
    navigate('UpdatePhone', {phone: phone})
  }

  showLockersList(lockers) {
    const { navigate }  = this.props.navigation;
    navigate('LockerList', {lockers: lockers})
  }

  fetch() {
    Promise.all([DashboardService.getInfo()])
    .then(results => {
      const dashboardData = results[0]
      const email = dashboardData.email
      const phone = dashboardData.mobilePhone || dashboardData.homePhone
      const plan = dashboardData.membership.plan
      this.setState({data: dashboardData, loading: false, error: null, email: email, phone:phone, plan:plan})
    })
    .catch(err => {
      this.setState({error: err, loading: false})
    })
  }

  render() {
    if(this.state.loading) {
      return <View style={{flex: 1, backgroundColor: Colors.white}}>
              <LoadingView />
              <FooterTabWithNavigation navigation={this.props.navigation} active={"details"}/>
            </View>
    }

    const firstName = this.state.data.firstName
    const lastName = this.state.data.lastName

    return (
      <Root>
        <Container>
        <NativeStatusBar/>
          <Content style={{backgroundColor: Colors.white}}>
            <SafeAreaView style={{marginTop: 40}}>
              <Text style={{marginLeft: 21, fontSize: 36, color: Colors.dark_gray, fontWeight: 'bold'}}>Membership</Text>
              <Text style={{marginLeft: 21, fontSize: 36, color: Colors.dark_gray, fontWeight: 'bold'}}>Details</Text>
            </SafeAreaView>
            <View style={{marginTop: 20}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: 16, color: Colors.gray_85, fontWeight: 'bold'}}>Current Plan</Text>
            </View>

            <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, marginTop: 15, height: 50, flex: 1}}>
              <TouchableHighlight onPress={() => {this.showChangePlan()}} underlayColor={'transparent'}>
                <Text style={{fontSize: 14, color: Theme.primaryColor, marginLeft: 21, fontWeight: '600'}}>
                  {this.state.plan}
                </Text>
              </TouchableHighlight>

              <View style={{position: 'absolute', right: 21, flex: 1, flexDirection:'row', zIndex: -1}}>
                <Text style={{color: Colors.gray_85, marginTop: Platform.OS === 'ios' ? 10 : 7}}>Upgrade</Text>
                <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, marginTop: 5}}/>
              </View>
            </View>

            <View style={{marginTop: 20}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>Contact Info</Text>
            </View>

            <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, marginTop: 15, height: 50, flex: 1}}>
              <TouchableHighlight onPress={() => {this.onEmail()}} underlayColor={'transparent'}>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21, width: 50}}>
                    Email
                  </Text>
                  <Text style={{fontSize: 14, color: Colors.gray_47, marginLeft: 21}}>
                    {this.state.email}
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
                    {this.state.phone}
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
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>Support</Text>
            </View>

            <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, marginTop: 20, height: 50, flex: 1, marginTop: 20}}>
              <TouchableHighlight onPress={() => {this.onSupport()}} underlayColor={'transparent'}>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <Text style={{fontSize: Utils.normalize(14), color: Colors.gray_85, marginLeft: 21}}>
                    Contact us
                  </Text>
                </View>
              </TouchableHighlight>
              <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 21}}/>
            </View>

            <View style={{marginTop: 20}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>Profile</Text>
            </View>

            <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, height: 50, flex: 1, marginTop: 20}}>
              <TouchableHighlight onPress={() => {this.showLockers()}} underlayColor={'transparent'}>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <Text style={{fontSize: Utils.normalize(14), color: Colors.gray_85, marginLeft: 21}}>
                    Lockers
                  </Text>
                </View>
              </TouchableHighlight>
              <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 21}}/>
            </View>

            <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, height: 50, flex: 1}}>
              <TouchableHighlight onPress={() => {this.showApplyCode()}} underlayColor={'transparent'}>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <Text style={{fontSize: Utils.normalize(14), color: Colors.gray_85, marginLeft: 21}}>
                    Promo Code
                  </Text>
                </View>
              </TouchableHighlight>
              <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 21}}/>
            </View>

            <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, height: 50, flex: 1}}>
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
