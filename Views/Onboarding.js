import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TextInput, TouchableHighlight, Image} from 'react-native';
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
import AccountService from '../Services/AccountService'
import ErrorView from './ErrorView'
import Swiper from 'react-native-swiper';
import Colors from '../Common/Colors'
import OnboardingService from '../Services/OnboardingService'

export default class Onboarding extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  onSkip() {
    if(this.props.onSkip) {
      OnboardingService.getInstance().markShown()
      this.props.onSkip()
    }
  }

  render() {
    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
          <View style={styles.background}>
          <TouchableHighlight onPress={() => {this.onSkip()}} underlayColor={'transparent'}>
            <View style={{marginTop: 35, marginRight: 20}}>
              <Text style={{textAlign: 'right', color: Colors.gray_85, fontSize: 16, zIndex: 1}}>Skip</Text>
            </View>
          </TouchableHighlight>
           <View style={{alignItems: 'center', marginTop: 40}}>
             <Image
              style={{width: 145, height: 111}}
              source={require('../Images/go_locker_grayscale.jpg')}
             />
             </View>

             <Swiper style={styles.wrapper} showsButtons={true} autoplay={true} showsButtons={false} activeDotColor={Theme.primaryColor} activeDotStyle={{height: 15, width: 15, borderRadius: 7.5}} dotStyle={{height: 10, width: 10, borderRadius: 5}}>
               <View style={styles.slide1}>
                 <Image
                  style={{width: 145, height: 111}}
                  source={require('../Images/gl-illustration-buy.png')}
                 />
                 <Text style={styles.text}>You order a frame for that photo from the bachelorette party. Yes, that one.</Text>
               </View>
               <View style={styles.slide2}>
                 <Image
                  style={{width: 145, height: 111}}
                  source={require('../Images/gl-illustration-pickup.png')}
                 />
                 <Text style={styles.text}>You go to your important job. You don’t have time to worry about your package.</Text>
               </View>
               <View style={styles.slide3}>
                 <Image
                  style={{width: 145, height: 111}}
                  source={require('../Images/gl-illustration-pick-up.png')}
                 />
                 <Text style={styles.text}>We accept your parcel and place it in our dreamy kiosk. It waits (safely and cozily) until you’re ready to pick it up.</Text>
               </View>
             </Swiper>

           </View>
          </Content>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    height: 340
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    textAlign: 'center',
    width: 250,
    fontSize: 16,
    color: Colors.gray_85,
    fontWeight: '600',
    marginTop: 20
  }
})
