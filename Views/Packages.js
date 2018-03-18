import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Theme from '../Common/Theme'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab} from 'native-base';
import LoadingView from './Loading'
import ReservationService from '../Services/ReservationService'

export default class PackagesView extends Component {
  static navigationOptions = { title: 'Packages', header: null, tabBarVisible: false };

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

  }

  render() {
    if(this.state.loading) {
      return (
        <Container>
          <Header androidStatusBarColor={Theme.secondaryColor} style={{backgroundColor: Theme.primaryColor}}>
            <Body>
              <Title style={{color: Colors.white, fontFamily: Theme.primaryFont}}>Incoming Packages</Title>
            </Body>
          </Header>
          <Content>
            <LoadingView style={{marginTop: 50}}/>
          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"package"}/>
        </Container>
      )
    }

    return (
      <Container>
        <Header androidStatusBarColor={Theme.secondaryColor} style={{backgroundColor: Theme.primaryColor}}>
          <Body>
            <Title style={{color: Colors.white, fontFamily: Theme.primaryFont}}>Incoming Packages</Title>
          </Body>
        </Header>
        <Content>
          <Card style={{marginTop: 5}}>
            <CardItem>
              <Body>
                <Text style={{fontFamily: Theme.primaryFont}}>
                   No tracking information available at this time
                </Text>
              </Body>
            </CardItem>
            </Card>
        </Content>
        <FooterTabWithNavigation navigation={this.props.navigation} active={"package"}/>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.primaryColor
  },
});
