import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, StatusBar } from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, List, ListItem, Separator, Root} from 'native-base';
import HeaderView from '../Elements/HeaderView'
import LoadingView from './Loading'
import Entypo from 'react-native-vector-icons/dist/Entypo'

export default class DetailsView extends Component {
  static navigationOptions = { title: 'Account', header: null, tabBarVisible: false };

  onLogoutPress = () => {

  }

  constructor(props) {
   super(props);

   this.state = {
     data: {},
     loading: false,
     error: null,
     plan: null
   };
  }

  componentDidMount() {
    this.setState({loading: true})
    this.fetch()
  }

  fetch() {
    Promise.all([DashboardService.getInfo()])
    .then(results => {
      this.setState({data: results[0], loading: false, error: null})
    })
    .catch(err => {
      this.setState({error: err, loading: false})
    })
  }

  render() {
    if(this.state.loading) {
      return <View style={{flex: 1}}>
              <LoadingView />
              <FooterTabWithNavigation navigation={this.props.navigation} active={"details"}/>
            </View>
    }

    const firstName = this.state.data.firstName
    const lastName = this.state.data.lastName

    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
            <View style={{marginTop: 30}}>
              <HeaderView title={`${Utils.capitalize(firstName)} ${Utils.capitalize(lastName)}`} details={"Show QR code"}/>
            </View>
            <View>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Membership</Text>
              <Text style={{marginLeft: 21, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Details</Text>
            </View>
            <View style={{marginTop: 20}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>Current Plan</Text>
            </View>

            <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, marginTop: 15, height: 50, flex: 1}}>
              <TouchableHighlight onPress={() => {this.onChangeLocker()}} underlayColor={'transparent'}>
                <Text style={{fontSize: Utils.normalize(14), color: Theme.primaryColor, marginLeft: 21, fontWeight: '600'}}>
                  Pay-per-package
                </Text>
              </TouchableHighlight>
              <View style={{justifyContent: 'center', position: 'absolute', right: 0, flex:1, flexDirection:'row', flexWrap:'wrap'}}>
                <Text style={{color: Colors.gray_85}}>Upgrade</Text>
                <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85}}/>
              </View>
            </View>

          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"details"}/>
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
  itemStyle: {
    height: 45,
    flex: 1,
    marginLeft: 0,
    paddingLeft: 20,
    backgroundColor: Colors.white
  },
  headerStyle: {
    height: 45
  },
  textStyle: {
    fontFamily: Theme.primaryFont
  }
});
