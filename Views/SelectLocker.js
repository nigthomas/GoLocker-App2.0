import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TouchableHighlight} from 'react-native';
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

export default class SelectLocker extends Component {
  static navigationOptions = { title: 'Packages', header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   this.state = {
     loading: false,
     data: {},
     error: null
   };
  }

  componentDidMount() {
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

  selectLocker(item) {
    if(this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.onLockerSelected) {
      this.props.navigation.goBack()
      this.props.navigation.state.params.onLockerSelected(item)
    }
  }

  renderItem(item) {
    const name = item.property.name
    const address= item.property.fullAddress()

    return (
      <TouchableHighlight onPress={() => {this.selectLocker(item)}} underlayColor={'transparent'}>
        <View style={{height: 50, paddingTop:5, paddingBottom: 5, paddingLeft: 21, paddingRight: 21, flexDirection: 'row', alignSelf: 'flex-start', borderBottomWidth: 1, borderBottomColor: Colors.gray_ef}}>
          <View style={{justifyContent: 'center', flex: 1}}>
            <Text style={{ color: Colors.dark_gray}}>{name}</Text>
            <Text style={{ color: Colors.gray_85}}>{address}</Text>
            <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 0}}/>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  onCancel() {
    this.props.navigation.goBack()
  }

  render() {
    if(this.state.loading) {
      return <LoadingView />
    }

    const firstName = this.state.data.firstName
    const lastName = this.state.data.lastName
    const data = (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) ? this.props.navigation.state.params.lockers : []

    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
            <TouchableHighlight onPress={() => {this.onCancel()}} underlayColor={'transparent'}>
              <View style={{marginRight: 21, marginTop: 30}}>
                <Text style={{textAlign: 'right', color: Colors.gray_85, fontSize: 16, zIndex: 1}}>Cancel</Text>
              </View>
            </TouchableHighlight>
            <Text style={{marginLeft:21, marginTop: 20, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Deliver to</Text>
            <View style={{marginTop: 20, marginLeft:21}}>
              <Text style={{fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>Select a locker</Text>
            </View>

            <View style={{borderTopColor: Colors.gray_ef, borderTopWidth: 1, marginTop: 10}}>
              <FlatList data={data} keyExtractor={(item, index) => item.id} renderItem={({ item }) => {return this.renderItem(item)}} backgroundColor={'white'}/>
            </View>
          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"ship"}/>
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
