import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TouchableHighlight, Modal, Image, SafeAreaView, ScrollView, Dimensions} from 'react-native';
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
import Swipeout from 'react-native-swipeout'
import MapView, { Marker } from 'react-native-maps';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome'

export default class HomeView extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   this.state = {
     data: {},
     loading: false,
     error: null,
     qrCodeShown: false
   };
  }

  componentDidMount() {
    this.setState({loading: true})
    this.fetch()
  }

  onRefresh() {
    this.setState({loading: true})
    this.fetch()
  }

  fetch() {
    Promise.all([DashboardService.getInfo(), ReservationService.getInstance().getReservations()])
    .then(results => {
      this.setState({data: results[0], loading: false, error: null})
    })
    .catch(err => {
      this.setState({error: err, loading: false})
    })
  }

  showLockerDetails(locker) {
    const { navigate }  = this.props.navigation;
    navigate('LockerDetailView', {locker: locker})
  }

  onShowQRCode() {
    this.setState({qrCodeShown: true})
  }

  canShowQRCode() {
    return Utils.ifDefNN(this.state.data.usernameQR)
  }

  renderQRCode() {
    const qrCodeData = this.state.data.usernameQR

    if(!qrCodeData) {
      return null
    }

    const base64Icon = 'data:image/png;base64,' + qrCodeData

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.qrCodeShown}
        onRequestClose={() => {
        }}>
        <SafeAreaView style={{marginTop: 30, flex: 1}}>
          <TouchableHighlight
            onPress={() => {
              this.setState({qrCodeShown: false});
            }}>
            <View style={{position: 'absolute', right: 21}}>
              <Text style={{color: Colors.gray_b5}}>Close</Text>
            </View>
          </TouchableHighlight>
          <View style={{flex: 1, marginTop: 100, marginLeft: 21, alignItems: 'center'}}>
              <Image style={{width: 164, height: 164}} source={{uri: base64Icon}}/>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }

  renderQRCodeButton() {
    if(!this.canShowQRCode()) {
      return null
    }

    const dashboardData = this.state.data || {}
    const accountNumber = dashboardData.accountNumber || ""

    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Text style={{marginLeft: 21, fontSize: 14, color: Colors.gray_ef, textAlign: 'left', flex: 1}}>Account #{accountNumber}</Text>
        <TouchableHighlight onPress={() => {this.onShowQRCode()}} underlayColor={'transparent'} style={{flex: 1, marginRight: 21, height: 50}}>
          <FontAwesome name="qrcode" size={30} style={{alignSelf: 'flex-end', color: Colors.white, marginTop: -10}}/>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    if(this.state.loading) {
      return <View style={{flex: 1, backgroundColor: Colors.white}}>
              <StatusBar
                backgroundColor={Colors.white}
                barStyle="dark-content"
              />
              <LoadingView />
              <FooterTabWithNavigation navigation={this.props.navigation} active={"home"}/>
            </View>
    }

    const dashboardData = this.state.data || {}
    const firstName = Utils.capitalize(dashboardData.firstName || "")
    const lastName = Utils.capitalize(dashboardData.lastName || "")
    const accountNumber = dashboardData.accountNumber || ""

    const primaryLocker = dashboardData && dashboardData.hasPrimaryLocker && dashboardData.hasPrimaryLocker() ? dashboardData.primaryLocker : null
    const secondaryLocker = dashboardData && dashboardData.hasSecondaryLocker && dashboardData.hasSecondaryLocker() ? dashboardData.secondaryLocker : null


    const qrCodeView = this.renderQRCode()
    const qrCodeButtonView = this.renderQRCodeButton()

    return (
      <Root>
        <Container>
        <StatusBar
          backgroundColor={Colors.white}
          barStyle="dark-content"
        />
          <Content style={{backgroundColor: Colors.white}}>
            <View style={{backgroundColor: Theme.primaryColor}}>
            <TouchableHighlight onPress={() => {this.onRefresh()}} underlayColor={'transparent'}>
              <SafeAreaView style={{position: 'absolute', right: 21, top: 40, height: 50, width: 50}}>
                <FontAwesome name="refresh" size={22} style={{alignSelf: 'flex-end', color: Colors.white}}/>
              </SafeAreaView>
            </TouchableHighlight>
            <View style={{marginTop: 60}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: 36, color: Colors.white, fontWeight: 'bold'}}>Welcome</Text>
              <Text style={{marginLeft: 21, fontSize: 36, color: Colors.white, fontWeight: 'bold'}}>{firstName} {lastName}</Text>
              {qrCodeButtonView}
            </View>
            {qrCodeView}
            </View>

            <Text style={{marginLeft: 21, fontSize: 16, marginTop:21, color: Colors.gray_85, fontWeight: 'bold'}}>Send packages to:</Text>
            <View style={{height: 80}}>
                <View>
                <Text style={{marginLeft: 21, paddingTop:9, fontSize: 14, color: Colors.gray_85}}>GoLocker HQ</Text>
                <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21, marginTop: 3}}>
                  209A Morgan Avenue - Ste F
                </Text>
                <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21, marginTop: 3}}>
                  Brooklyn, NY 11237
                </Text>
                </View>
            </View>

            <Text style={{marginLeft: 21, fontSize: 16, marginTop:21, color: Colors.gray_85, fontWeight: 'bold'}}>Packages:</Text>


          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"home"}/>
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
