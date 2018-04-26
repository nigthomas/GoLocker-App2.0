import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TouchableHighlight, SafeAreaView} from 'react-native';
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

export default class OptionSelector extends Component {
  static navigationOptions = { title: 'Packages', header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   const options = (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) ? this.props.navigation.state.params.options : []
   const pageTitle = (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) ? this.props.navigation.state.params.pageTitle : ""
   const selectedTab = (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) ? this.props.navigation.state.params.selectedTab : "details"
   const addText = (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) ? this.props.navigation.state.params.addText : "Add"


   this.state = {
     options: options,
     pageTitle: pageTitle,
     selectedTab: selectedTab,
     addText: addText
   };
  }

  componentDidMount() {
    this.setState({loading: true})
    this.fetch()
  }

  select(item) {

  }

  renderItem(item) {
    const title = item.title
    const detail= item.detail

    return (
      <TouchableHighlight onPress={() => {this.selectLocker(item)}} underlayColor={'transparent'}>
        <View style={{height: 50, paddingTop:5, paddingBottom: 5, paddingLeft: 21, paddingRight: 21, flexDirection: 'row', alignSelf: 'flex-start', borderBottomWidth: 1, borderBottomColor: Colors.gray_ef}}>
          <View style={{justifyContent: 'center', flex: 1}}>
            <Text style={{ color: Colors.dark_gray}}>{title}</Text>
            <Text style={{ color: Colors.gray_85}}>{detail}</Text>
            <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 0}}/>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  onBackPress() {
    this.props.navigation.goBack()
  }

  render() {
    const data = this.state.options || []
    const title = this.state.pageTitle
    const selectedTab = this.state.selectedTab

    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
            <View style={{marginTop: 50}}>
              <TouchableHighlight onPress={() => {this.onBackPress()}} underlayColor={'transparent'}>
                <SafeAreaView style={{width: 50, height: 50, position: 'absolute', left: 21}}>
                  <Text style={{color: Colors.gray_85}}>Back</Text>
                </SafeAreaView>
              </TouchableHighlight>
              <Text style={{textAlign: 'center', fontWeight: 'bold', color: Colors.dark_gray}}>{title}</Text>
            </View>

            <View style={{borderTopColor: Colors.gray_ef, borderTopWidth: 1, marginTop: 10}}>
              <FlatList data={data} keyExtractor={(item, index) => item.id} renderItem={({ item }) => {return this.renderItem(item)}} backgroundColor={'white'}/>
            </View>

            <TouchableHighlight onPress={() => {this.onAdd()}} underlayColor={'transparent'}>
              <View style={{justifyContent: 'center', borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, height: 50, flex: 1, marginRight: 21}}>
                <Text style={{color: Colors.dark_gray, marginLeft: 21}}>{addText}</Text>
                <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 0}}/>
              </View>
            </TouchableHighlight>
          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={selectedTab}/>
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
