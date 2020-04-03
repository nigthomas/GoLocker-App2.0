import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TextInput, TouchableHighlight, Platform, SafeAreaView} from 'react-native';
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
import NativeStatusBar from '../Elements/NativeStatusBar'

export default class ChangePlan extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   this.state = {
     selectedPlan: null,
     loading: false,
     data: {},
     error: null,
     code: null
   };
  }

  onSavePress() {
    const plan = this.state.selectedPlan
    const code = plan == "Pay-Per-Package" ? null : this.state.code

    AccountService.getInstance().updatePlan(plan, code)
    .then(() => {
      this.props.navigation.goBack()
      this.setState({error: null})
    })
    .catch(err => {
      this.setState({error: err})
    })
  }

  componentDidMount() {
    this.setState({loading: true})
    this.fetch()
  }

  fetch() {
    Promise.all([DashboardService.getInfo()])
    .then(results => {
      const dashboardData = results[0] || {}
      const membership = dashboardData.membership
      this.setState({data: dashboardData, selectedPlan: membership.plan,loading: false, error: null})
    })
    .catch(err => {
      this.setState({error: err, loading: false})
    })
  }

  onBackPress() {
    this.props.navigation.goBack()
  }

  renderUnlimited(unlimitedStyle, unlimitedCircleStyle) {
    return (
        <TouchableHighlight onPress={() => { this.setState({selectedPlan: "Unlimited"})}} underlayColor={'transparent'}>
          <View style={unlimitedStyle}>
            <View style={{flex: 1}}>
              <Text style={styles.headerText}>Unlimited</Text>
              <Text style={styles.text}>Unlimited Deliveries!</Text>
              <Text style={styles.text}>Pickup within 48 hours</Text>
              <Text style={styles.text}>Secure and Convenient</Text>
            </View>
            <View style={{flex: 1}}>
              <View style={unlimitedCircleStyle}></View>
              <Text style={styles.price}>$14.99</Text>
              <Text style={styles.cycle}>/per month</Text>
            </View>
          </View>
        </TouchableHighlight>)
  }

  renderPromoCodeField() {
    return (
      <View style={{marginTop: 5}}>
        <TextInput underlineColorAndroid='transparent' placeholderTextColor={Colors.gray_85} style={{color: Colors.dark_gray, backgroundColor: Colors.white, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont, paddingLeft: 10}} placeholder={"Enter Promo Code"} onChangeText={(code) => this.setState({code: code.toUpperCase()})} value={this.state.code}/>
      </View>
    )
  }

  render() {
    if(this.state.loading) {
      return <View style={{flex: 1, backgroundColor: Colors.white}}>
              <LoadingView />
              <FooterTabWithNavigation navigation={this.props.navigation} active={"details"}/>
            </View>
    }

    const payPerPackageSelected = this.state.selectedPlan === "Pay-Per-Package"
    const premiumSelected = this.state.selectedPlan === "Premium"
    const unlimitedSelected = this.state.selectedPlan === "Unlimited"
    const premierSelected = this.state.selectedPlan === "Premier"

    const payPerPackageStyle = payPerPackageSelected ? styles.activePlan : styles.plan
    const premiumStyle = premiumSelected ? styles.activePlan : styles.plan
    const unlimitedStyle = unlimitedSelected ? styles.activePlan : styles.plan
    const premierStyle = premierSelected ? styles.activePlan : styles.plan

    const payPerPackageCircleStyle = payPerPackageSelected ? styles.activeCircle : styles.circle
    const premiumCircleStyle = premiumSelected ? styles.activeCircle : styles.circle
    const unlimitedCircleStyle = unlimitedSelected ? styles.activeCircle : styles.circle
    const premierCircleStyle = premierSelected ? styles.activeCircle : styles.circle

    const error = "Something is wrong. Make sure you have a payment method and valid billing address. If you entered a promo code, make sure the code is valid."
    const errorText = this.state.error ? <Text style={{marginLeft: 21, color: Colors.red, marginTop: 5}}>{error}</Text> : null
    const unlimitedPlanView = unlimitedSelected ? this.renderUnlimited(unlimitedStyle, unlimitedCircleStyle) : null

    const premiumPromoField = premiumSelected ? this.renderPromoCodeField() : null
    const premierPromoField = premierSelected ? this.renderPromoCodeField() : null

    return (
      <Root>
        <Container>
        <NativeStatusBar/>
          <Content style={{backgroundColor: Colors.white}}>
          <SafeAreaView style={{marginTop: 20}}>
            <ThreeHeaderView title={"Update Plan"} leftButtonTitle={"Back"} rightButtonTitle={"Update"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onSavePress()}}/>
          </SafeAreaView>
          {errorText}
          <View style={{marginLeft: 21, marginRight: 21}}>

            <TouchableHighlight onPress={() => { this.setState({selectedPlan: "Pay-Per-Package"})}} underlayColor={'transparent'}>
              <View style={payPerPackageStyle}>
                <View style={{flexDirection:'row'}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.headerText}>PAY PER PACKAGE</Text>
                    <Text style={styles.text}>Pickup within 48 hours</Text>
                    <Text style={styles.text}>Secure and Convenient</Text>
                  </View>
                  <View style={{flex: 1}}>
                      <View style={payPerPackageCircleStyle}></View>
                      <Text style={styles.price}>$5</Text>
                      <Text style={styles.cycle}>/per delivery*</Text>
                    </View>
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => { this.setState({selectedPlan: "Premium"})}} underlayColor={'transparent'}>
              <View style={premiumStyle}>
                <View style={{flexDirection:'row'}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.headerText}>PREMIUM</Text>
                    <Text style={styles.text}>10 Deliveries Per Month</Text>
                    <Text style={styles.text}>Pickup within 48 hours</Text>
                    <Text style={styles.text}>Secure and Convenient</Text>
                    <Text style={styles.text}>*1.75 Overage Fee</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <View style={premiumCircleStyle}></View>
                    <Text style={styles.price}>$20</Text>
                    <Text style={styles.cycle}>/per month**</Text>
                  </View>
                </View>
                {premiumPromoField}
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => { this.setState({selectedPlan: "Premier"})}} underlayColor={'transparent'}>
              <View style={premierStyle}>
                <View style={{flexDirection:'row'}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.headerText}>PREMIER</Text>
                    <Text style={styles.text}>20 Deliveries Per Month</Text>
                    <Text style={styles.text}>Pickup within 48 hours</Text>
                    <Text style={styles.text}>Secure and Convenient</Text>
                    <Text style={styles.text}>*1.25 Overage Fee</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <View style={premierCircleStyle}></View>
                    <Text style={styles.price}>$30</Text>
                    <Text style={styles.cycle}>/per month**</Text>
                  </View>
                </View>
                {premierPromoField}
              </View>
            </TouchableHighlight>

            {unlimitedPlanView}

            <Text style={styles.disclaimer}>Please note when downgrading your account, the current plan will remain effective through the end of the billing period. Plan upgrades take effect immediately.</Text>

          </View>

          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"details"}/>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  price: {
    color: Colors.dark_gray,
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
    marginTop: 30
  },
  cycle: {
    color: Colors.dark_gray,
    fontSize: 12,
    flex: 1,
    textAlign: 'right'
  },
  disclaimer: {
    color: Colors.dark_gray,
    fontSize: 12,
    marginTop: 20
  },
  headerText: {
    color: Colors.dark_gray,
    fontSize: 14,
    marginBottom: 5
  },
  text: {
    color: Colors.dark_gray,
    fontSize: 12,
    marginTop: 5
  },
  activePlan: {
    padding: 10,
    borderRadius: 4,
    borderColor: Colors.dark_gray,
    borderWidth: 1,
    marginTop: 20,
    backgroundColor: Colors.gray_f3,
  },
  plan: {
    padding: 10,
    borderRadius: 4,
    borderColor: Colors.gray_d8,
    borderWidth: 1,
    marginTop: 20,
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 50/2,
    borderWidth: 1,
    position: 'absolute',
    borderColor: Colors.gray_85,
    right: 10,
    top: 3
  },
  activeCircle: {
    width: 25,
    height: 25,
    borderRadius: 50/2,
    backgroundColor: Colors.light_green,
    position: 'absolute',
    right: 10,
    top: 3
  }
});
