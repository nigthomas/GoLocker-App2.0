import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, Platform} from 'react-native';
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, Right} from 'native-base';
import FooterTabWithNavigation from './FooterTabWithNavigation'
import ClearButton from '../Elements/ClearButton'
import Colors from '../Common/Colors'
import Theme from '../Common/Theme'
import DashboardService from '../Services/DashboardService'
import AlertView from '../Elements/AlertView'
import LoadingView from './Loading'
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons'

export default class DashboardView extends Component {
  static navigationOptions = { title: 'Dashboard', header: null, tabBarVisible: false};

  constructor(props) {
   super(props);

   this.state = {
     data: null,
     loading: false,
     error: null
   };
  }

  componentDidMount() {
    this.setState({loading: true})
    this.fetch()
  }

  fetch() {
    DashboardService.getInfo()
    .then(dashboard => {
      this.setState({data: dashboard, loading: false})
    })
    .catch(err => {
      this.setState({error: err, loading: false})
      console.log(err)
    })
  }

  renderLockerCards() {
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

    return lockers.map((locker, i) => {
      return <Card key={i}>
              <CardItem>
                <Left>
                <MaterialCommunityIcons name={"locker"} size={25} color={Theme.primaryColor} />
                  <Body>
                    <Text>{locker.property.name}</Text>
                    <Text note style={{color: 'gray'}}>{locker.isPrimary ? 'PRIMARY' : 'SECONDARY'}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
                <Image source={require('../Images/maps.png')} style={{height: 200, width: null, flex: 1}}/>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={{color: 'gray'}}>{locker.property.address}</Text>
                  <Text >{locker.property.city}, {locker.property.stateProvince} {locker.property.postalCode}</Text>
                </Body>
              </CardItem>
              <CardItem>
                <View style={{marginLeft: 0, padding: 0, marginLeft: -10}}>
                  <ClearButton fontSize={14} fontWeight={'normal'} color={Theme.primaryColor} padding={0} style={{backgroundColor: 'transparent'}} onPress={this.onLoginPress} title={"SHIP A PACKAGE"}/>
                </View>
              </CardItem>
            </Card>
    })
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

    const lockerCards = this.renderLockerCards()

    return (
      <Container>
        <Header androidStatusBarColor={Theme.secondaryColor} style={{backgroundColor: Theme.primaryColor}}>
          <Body>
            <Title style={{color: Colors.white, fontFamily: Theme.primaryFont}}>Dashboard</Title>
          </Body>
        </Header>
        <Content>
          {lockerCards}
        </Content>
        <FooterTabWithNavigation navigation={this.props.navigation} active={"dashboard"}/>
      </Container>
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
