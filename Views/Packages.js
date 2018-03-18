import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Theme from '../Common/Theme'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, Root, Right} from 'native-base';
import LoadingView from './Loading'
import ReservationService from '../Services/ReservationService'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'
import ClearButton from '../Elements/ClearButton'

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

  componentWillMount() {
    StatusBar.setBarStyle('light-content', true);
  }

  componentDidMount() {
    this.setState({loading: true})
    this.fetch()
  }

  emptyCard(message) {
    return (
      <Root>
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
                    {message}
                  </Text>
                </Body>
              </CardItem>
              </Card>
          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"package"}/>
        </Container>
      </Root>
    );
  }

  errorCard(message) {
    return (
      <Root>
        <Container>
          <Header androidStatusBarColor={Theme.secondaryColor} style={{backgroundColor: Theme.primaryColor}}>
            <Body>
              <Title style={{color: Colors.white, fontFamily: Theme.primaryFont}}>Incoming Packages</Title>
            </Body>
          </Header>
          <Content>
            <Card>
              <CardItem style={{borderBottomColor: Colors.gray_ef, borderBottomWidth: 1}}>
                <Body>
                  <Text style={{fontSize: 15, fontWeight: '300'}}>{message}</Text>
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
          <FooterTabWithNavigation navigation={this.props.navigation} active={"package"}/>
        </Container>
      </Root>
    );
  }

  loadingCard() {
    return (
      <Root>
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
      </Root>
    )
  }

  fetch() {
    Promise.all([ReservationService.getReservations()])
    .then(results => {
      this.setState({data: results[0], loading: false, error: null})
    })
    .catch(err => {
      this.setState({error: err, loading: false})
      console.log(err)
    })
  }

  render() {
    if(this.state.loading) {
      const loadingCard = this.loadingCard()
      return loadingCard
    }

    if(this.state.error) {
      const errorCard = this.errorCard("Whoops! An error has occurred")
      return errorCard
    }

    if(this.state.data && this.state.data.length == 0) {
      const emptyCard = this.emptyCard("No tracking information available at this time")
      return emptyCard
    }

    return (
      <Root>
        <Container>
          <Header androidStatusBarColor={Theme.secondaryColor} style={{backgroundColor: Theme.primaryColor}}>
            <Body>
              <Title style={{color: Colors.white, fontFamily: Theme.primaryFont}}>Incoming Packages</Title>
            </Body>
          </Header>
          <Content>
            <Card style={{marginTop: 5}} dataArray={this.state.data} renderRow={(reservation)=> {

            }}>
              <CardItem>

              </CardItem>
            </Card>
          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"package"}/>
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
