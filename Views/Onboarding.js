import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TextInput, TouchableHighlight, Image, SafeAreaView} from 'react-native';
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
        <StatusBar
          backgroundColor={Colors.gray_f1}
          barStyle="dark-content"
        />
          <Content style={{backgroundColor: Colors.gray_f1}}>
          <View>
           <View style={{alignItems: 'center', marginTop: 60}}>
             <Image
              style={{width: 198/3.5, height: 151/3.5}}
              source={require('../Images/golockerLogo.png')}
             />
             </View>
               <SafeAreaView style={{position: 'absolute', right: 21, top: 30, width: 55, height: 55}}>
                 <TouchableHighlight onPress={() => {this.onSkip()}} underlayColor={'transparent'}>
                   <Text style={{textAlign: 'right', color: Colors.gray_85, fontSize: 16, fontWeight: '300'}}>Skip</Text>
                </TouchableHighlight>
               </SafeAreaView>
             <Swiper style={styles.wrapper} showsButtons={true} autoplay={true} showsButtons={false} activeDotColor={Theme.primaryColor} activeDotStyle={{height: 15, width: 15, borderRadius: 7.5}} dotStyle={{height: 10, width: 10, borderRadius: 5}}>
               <View style={styles.slide1}>
                  <View style={{width: 250, height: 250, borderRadius: 125, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center'}}>
                     <Image
                      style={{width: 145, height: 111}}
                      source={require('../Images/gl-illustration-buy.png')}
                     />
                 </View>
                 <Text style={styles.text}>You order a frame for that photo from the bachelorette party. Yes, that one.</Text>
               </View>
               <View style={styles.slide2}>
                <View style={{width: 250, height: 250, borderRadius: 125, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center'}}>
                   <Image
                    style={{width: 145, height: 111}}
                    source={require('../Images/gl-illustration-pickup.png')}
                   />
                 </View>
                 <Text style={styles.text}>You go to your important job. You don’t have time to worry about your package.</Text>
               </View>
               <View style={styles.slide3}>
                 <View style={{width: 250, height: 250, borderRadius: 125, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center'}}>
                   <Image
                    style={{width: 145, height: 111}}
                    source={require('../Images/gl-illustration-pick-up.png')}
                   />
                 </View>
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
    height: 475
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
    width: 300,
    fontSize: 15,
    color: Colors.gray_85,
    fontWeight: '200',
    marginTop: 35
  }
})
