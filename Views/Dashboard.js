import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, Platform, TouchableHighlight} from 'react-native';
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, Right, ActionSheet, Root} from 'native-base';
import FooterTabWithNavigation from './FooterTabWithNavigation'
import ClearButton from '../Elements/ClearButton'
import Colors from '../Common/Colors'
import Theme from '../Common/Theme'
import DashboardService from '../Services/DashboardService'
import AlertView from '../Elements/AlertView'
import LoadingView from './Loading'
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import _ from 'underscore'
import LoginService from '../Services/LoginService'
import Utils from '../Common/Utils'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'

const CANCEL_INDEX = 3

export default class DashboardView extends Component {
  static navigationOptions = { title: 'Dashboard', header: null, tabBarVisible: false};

  constructor(props) {
   super(props);

   this.state = {
     data: null,
     loading: false,
     error: null,
     account: null
   };
  }

  componentWillMount() {
    StatusBar.setBarStyle('light-content', true);
  }

  componentDidMount() {
    ActionSheet.actionsheetInstance = null;

    this.setState({loading: true})
    this.fetch()
  }

  fetch() {
    Promise.all([DashboardService.getInfo()])
    .then(results => {
      this.setState({data: results[0], loading: false})
    })
    .catch(err => {
      this.setState({error: err, loading: false})
    })
  }

  cardOnPress (locker) {
    if(!locker) {
      return
    }

    const ACTION_SHEET_BUTTONS = locker.isPrimaryLocker() ? [{ text: "Set as Secondary" }, { text: "Change Locker" }, { text: "Cancel" }] : [{ text: "Change Locker" }, { text: "Cancel" }];
    ActionSheet.show({options: ACTION_SHEET_BUTTONS, cancelButtonIndex: CANCEL_INDEX, title: "Select option"}, buttonIndex => {})
  }

  lockerCards() {
    if(!this.state.data || (!this.state.data.hasPrimaryLocker() && !this.state.data.hasSecondaryLocker())) {
      return (<Card></Card>)
    }

    var lockers = []

    if(this.state.data.hasPrimaryLocker()) {
      lockers.push(this.state.data.primaryLocker)
    }

    if(this.state.data.hasSecondaryLocker()) {
      lockers.push(this.state.data.secondaryLocker)
    }

    lockers = _.uniq(lockers, 'id')

    return lockers.map((locker, i) => {
      return <Card key={i}>
              <CardItem>
                <Left>
                  <MaterialCommunityIcons name={"locker"} size={25} color={Theme.primaryColor} />
                  <Body>
                  <Text>{locker.property.name}</Text>
                  <Text note style={{color: Colors.gray}}>{locker.isPrimary ? 'Primary' : 'Secondary'}</Text>
                  </Body>
                  <TouchableHighlight onPress={() => {this.cardOnPress(locker)}} underlayColor={'transparent'}>
                    <View style={{width: 50, alignItems: 'flex-end'}}>
                      <Ionicons name={"md-more"} size={30} color={'gray'}/>
                    </View>
                  </TouchableHighlight>
                </Left>
              </CardItem>
              <CardItem cardBody>
                <Image source={require('../Images/maps.png')} style={{height: 200, width: null, flex: 1}}/>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={{color: Colors.gray}}>{locker.property.address}</Text>
                  <Text >{locker.property.city}, {locker.property.stateProvince} {locker.property.postalCode}</Text>
                </Body>
              </CardItem>
              <CardItem style={{borderTopColor: Colors.gray_ef, borderTopWidth: 1}}>
                <View style={{marginLeft: 0, padding: 0, marginLeft: -10}}>
                  <ClearButton fontSize={13} fontWeight={'bold'} color={Theme.primaryColor} padding={0} style={{backgroundColor: 'transparent'}} onPress={this.onLoginPress} title={"SHIP A PACKAGE"}/>
                </View>
              </CardItem>
            </Card>
    })
  }

  welcomeCard () {
    if(!this.state.data) {
      return
    }

    const firstName = Utils.capitalize(this.state.data.firstName)
    const lastName = Utils.capitalize(this.state.data.lastName)
    const accountNumber = this.state.data.accountNumber

    return (
        <Card>
          <CardItem style={{borderBottomColor: Colors.gray_ef, borderBottomWidth: 1}}>
            <Body>
              <Text style={{fontSize: 15, fontWeight: '300'}}>Welcome {firstName}</Text>
              <Text style={{fontSize: 13, fontWeight: '300', color: Colors.gray}}>Account Number: {accountNumber}</Text>
            </Body>
            <Right>
              <MaterialCommunityIcons name={"account"} size={25} color={Theme.primaryColor} />
            </Right>
           </CardItem>
           <CardItem>
             <Body>
               <Text style={{fontSize: 15, fontWeight: '300'}}>Send Deliveries To:</Text>
               <Text style={{fontSize: 13, fontWeight: '300', color: Colors.gray}}>GoLocker</Text>
               <Text style={{fontSize: 13, fontWeight: '300', color: Colors.gray}}>209A Morgan Avenue - Ste F</Text>
               <Text style={{fontSize: 13, fontWeight: '300', color: Colors.gray}}>Brooklyn, NY 11237</Text>
             </Body>
             <Right>
             </Right>
            </CardItem>
         </Card>
      )
  }

  render() {
    if(this.state.loading) {
      return (
        <Container>
          <Header androidStatusBarColor={Theme.secondaryColor} style={{backgroundColor: Theme.primaryColor}}>
            <Body>
              <Title style={{color: Colors.white, fontFamily: Theme.primaryFont}}>Dashboard</Title>
            </Body>
          </Header>
          <Content>
            <LoadingView style={{marginTop: 50}}/>
          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"dashboard"}/>
        </Container>
      )
    }

    if(this.state.error) {
      return (
        <Root>
          <Container>
            <Header androidStatusBarColor={Theme.secondaryColor} style={{backgroundColor: Theme.primaryColor}}>
              <Body>
                <Title style={{color: Colors.white, fontFamily: Theme.primaryFont}}>Dashboard</Title>
              </Body>
            </Header>
            <Content>
              <Card>
                <CardItem style={{borderBottomColor: Colors.gray_ef, borderBottomWidth: 1}}>
                  <Body>
                    <Text style={{fontSize: 15, fontWeight: '300'}}>Whoops! An error has occurred</Text>
                  </Body>
                  <Right>
                    <MaterialIcons name={"error-outline"} size={25} color={Colors.red} />
                  </Right>
                 </CardItem>
                 <CardItem style={{borderTopColor: Colors.gray_ef, borderTopWidth: 1}}>
                   <View style={{marginLeft: 0, padding: 0, marginLeft: -10}}>
                     <ClearButton fontSize={13} fontWeight={'bold'} color={Theme.primaryColor} padding={0} style={{backgroundColor: 'transparent'}} onPress={() => this.fetch()} title={"TRY AGAIN"}/>
                   </View>
                 </CardItem>
               </Card>
            </Content>
            <FooterTabWithNavigation navigation={this.props.navigation} active={"dashboard"}/>
          </Container>
        </Root>
      )
    }

    const lockerCards = this.lockerCards()
    const welcomeCard = this.welcomeCard()

    return (
        <Root>
          <Container>
            <Header androidStatusBarColor={Theme.secondaryColor} style={{backgroundColor: Theme.primaryColor}}>
              <Body>
                <Title style={{color: Colors.white, fontFamily: Theme.primaryFont}}>Dashboard</Title>
              </Body>
            </Header>
            <Content>
              {welcomeCard}
              {lockerCards}
            </Content>
            <FooterTabWithNavigation navigation={this.props.navigation} active={"dashboard"}/>
          </Container>
        </Root>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    ...Platform.select({
      ios: {
        color: Theme.primaryColor
      },
      android: {
        color: Colors.white
      }
    })
  },
  iconSelected: {
    ...Platform.select({
      ios: {
        color: Theme.secondaryColor
      },
      android: {
        color: Theme.secondaryColor
      }
    })
  },
  footer: {
    ...Platform.select({
      android: {
        backgroundColor: Theme.primaryColor,
      }
    })
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
