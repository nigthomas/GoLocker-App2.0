import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TextInput, TouchableHighlight, Platform} from 'react-native';
import Theme from '../Common/Theme'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, Root, Right} from 'native-base';
import LoadingView from './Loading'
import DashboardService from '../Services/DashboardService'
import ReservationService from '../Services/ReservationService'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'
import ClearButton from '../Elements/ClearButton'
import HeaderView from '../Elements/HeaderView'
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import Moment from 'moment'
import Utils from '../Common/Utils'
import Swipeout from 'react-native-swipeout';
import ThreeHeaderView from '../Elements/ThreeHeaderView'

export default class ChangePlan extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   this.state = {
     selectedPlan: null
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
            <ThreeHeaderView title={"Update Plan"} leftButtonTitle={"Back"} rightButtonTitle={"Save"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onSavePress()}}/>
          </View>

          <View style={{marginLeft: 21, marginRight: 21}}>
            <View style={styles.activePlan}>
              <View style={{flex: 1}}>
                <Text style={styles.headerText}>PAY PER PACKAGE</Text>
                <Text style={styles.text}>Pickup within 48 hours</Text>
                <Text style={styles.text}>Secure and Convenient</Text>
                <Text style={styles.text}>Free First Delivery</Text>
              </View>
              <View style={{flex: 1}}>
                <View style={styles.activeCircle}></View>
                <Text style={styles.price}>$1.99</Text>
                <Text style={styles.cycle}>/per delivery*</Text>
              </View>
            </View>

            <View style={styles.plan}>
              <View style={{flex: 1}}>
                <Text style={styles.headerText}>PREMIUM</Text>
                <Text style={styles.text}>10 Deliveries Per Month</Text>
                <Text style={styles.text}>Pickup within 48 hours</Text>
                <Text style={styles.text}>Secure and Convenient</Text>
                <Text style={styles.text}>Free First Delivery</Text>
              </View>
              <View style={{flex: 1}}>
                <View style={styles.circle}></View>
                <Text style={styles.price}>$7.99</Text>
                <Text style={styles.cycle}>/per month</Text>
              </View>
            </View>
            <View style={styles.plan}>
              <View style={{flex: 1}}>
                <Text style={styles.headerText}>UNLIMITED</Text>
                <Text style={styles.text}>Unlimited Deliveries!</Text>
                <Text style={styles.text}>Pickup within 48 hours</Text>
                <Text style={styles.text}>Secure and Convenient</Text>
                <Text style={styles.text}>Free First Delivery</Text>
              </View>
              <View style={{flex: 1}}>
                <View style={styles.circle}></View>
                <Text style={styles.price}>$14.99</Text>
                <Text style={styles.cycle}>/per month</Text>
              </View>
            </View>

            <Text style={styles.disclaimer}>* A $0.31 processing fee will be applied to each pay per package delivery</Text>
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
    height: Platform.OS === 'ios' ? 120 : 140,
    borderRadius: 4,
    borderColor: Colors.dark_gray,
    borderWidth: 1,
    marginTop: 30,
    backgroundColor: Colors.gray_f3,
    flexDirection:'row'
  },
  plan: {
    padding: 10,
    height: Platform.OS === 'ios' ? 120 : 140,
    borderRadius: 4,
    borderColor: Colors.gray_d8,
    borderWidth: 1,
    marginTop: 30,
    flexDirection:'row'
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
