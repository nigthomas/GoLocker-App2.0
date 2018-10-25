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
     code: null
   };

  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    const selectedPlan = params.selectedPlan || "Pay-Per-Package"
    const onSelect = params.onSelect || this.onSelect

    this.setState({selectedPlan: selectedPlan, onSelect: onSelect})
  }

  onBackPress() {
    this.props.navigation.goBack()
  }

  onSelect() {
    //Empty
  }

  onRightPress(options) {
    const code = this.state.code
    const selectedPlan = this.state.selectedPlan

    this.state.onSelect({
      code: code,
      selectedPlan: selectedPlan
    })
    this.props.navigation.goBack()
  }

  renderPromoCodeField() {
    return (
      <View style={{marginTop: 5}}>
        <TextInput underlineColorAndroid='transparent' placeholderTextColor={Colors.gray_85} style={{color: Colors.dark_gray, backgroundColor: Colors.white, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont, paddingLeft: 10}} placeholder={"Enter Promo Code"} onChangeText={(code) => this.setState({code: code.toUpperCase()})} value={this.state.code}/>
      </View>
    )
  }

  render() {
    const payPerPackageSelected = this.state.selectedPlan === "Pay-Per-Package"
    const premiumSelected = this.state.selectedPlan === "Premium"
    const premierSelected = this.state.selectedPlan === "Premier"

    const payPerPackageStyle = payPerPackageSelected ? styles.activePlan : styles.plan
    const premiumStyle = premiumSelected ? styles.activePlan : styles.plan
    const premierStyle = premierSelected ? styles.activePlan : styles.plan

    const payPerPackageCircleStyle = payPerPackageSelected ? styles.activeCircle : styles.circle
    const premiumCircleStyle = premiumSelected ? styles.activeCircle : styles.circle
    const premierCircleStyle = premierSelected ? styles.activeCircle : styles.circle

    const premiumPromoField = premiumSelected ? this.renderPromoCodeField() : null
    const premierPromoField = premierSelected ? this.renderPromoCodeField() : null

    return (
      <Root>
        <Container>
        <NativeStatusBar/>
          <Content style={{backgroundColor: Colors.white}}>
          <SafeAreaView style={{marginTop: 20}}>
            <ThreeHeaderView title={"Select Plan"} leftButtonTitle={"Back"} rightButtonTitle={"Done"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onRightPress()}} />
          </SafeAreaView>
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
                      <Text style={styles.price}>$3</Text>
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

            <Text style={styles.disclaimer}>* A $0.31 processing fee will be applied to each pay per package delivery</Text>
            <Text style={styles.disclaimer}>** $2 overage fee</Text>
            <Text style={styles.disclaimer}>Please note when downgrading your account, the current plan will remain effective through the end of the billing period. Plan upgrades take effect immediately.</Text>

          </View>

          </Content>
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
