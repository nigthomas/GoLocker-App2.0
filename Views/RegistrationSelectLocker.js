import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Alert, Image, TouchableHighlight, FlatList, SafeAreaView} from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import FlatButton  from '../Elements/FlatButton'
import PropertyService from '../Services/PropertyService'
import { Container, Header, Content, Form, Item, Input, Label, Root } from 'native-base';
import MapView from 'react-native-maps';
import ThreeHeaderView from '../Elements/ThreeHeaderView'
import NativeStatusBar from '../Elements/NativeStatusBar'

export default class RegistrationSelectLocker extends Component {
  constructor(props) {
   super(props);

   this.state = {}
  }

  onLoginPress() {
    const { navigation } = this.props;
    navigation.popToTop()
  }

  onPropertyPress(property) {
    const { navigation } = this.props;
    navigation.navigate('RegistrationCreditForm', {property: property})
  }

  onBackPress() {
    this.props.navigation.goBack()
  }

  renderItem(property) {
    if(!property) {
      return (<View></View>)
    }

    const location = (property.location) ? property.location : null
    const name = property.name
    const address = property.address
    const city = property.city
    const state = property.stateProvince
    const zip = property.postalCode

    if(!location) {
      return (
        <View></View>
      )
    }

    return (
      <TouchableHighlight onPress={() => {this.onPropertyPress(property)}} underlayColor={'transparent'}>
        <View style={{flex: 1, marginBottom: 30}}>
          <View style={{flex: 1}}>
            <MapView
              style={{flex: 1, height: 200, borderRadius: 4}}
              scrollEnabled={false}
              initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0222,
              longitudeDelta: 0.0221,
              }}
              />
            </View>
            <View>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={{fontSize: 16, color: Colors.dark_gray, marginTop: 10, fontWeight: '600', flex: 2}}>{name}</Text>
              </View>
              <Text style={{fontSize: 14, color: Colors.gray_85, marginTop: 10}}>{address}</Text>
              <Text style={{fontSize: 14, color: Colors.gray_85}}>{city}, {state}, {zip}</Text>
            </View>
        </View>
      </TouchableHighlight>
      )
  }

  static navigationOptions = { header: null };
  render() {
    const lockers = (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) ? this.props.navigation.state.params.lockers : []
    const headerText = lockers.length == 1 ? "Great! We found 1 close by locker" : `Great! We found ${lockers.length} close by lockers`
    const text = "Please select one locker"
    var errorText = this.state.errorMessage ? <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>{this.state.errorMessage}</Text> : null

    if(!errorText && this.state.error ) {
      errorText = <Text style={{marginLeft: 21, color: Colors.red, marginRight: 21}}>Something is wrong. Please try again</Text>
    }

    return (
        <Container>
        <NativeStatusBar/>
          <Content style={{backgroundColor: Colors.white}}>
              <SafeAreaView style={{marginTop: 20}}>
                <ThreeHeaderView title={""} leftButtonTitle={"Back"} rightButtonTitle={"Sign in"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onLoginPress()}}/>
              </SafeAreaView>
              <View style={{marginTop: 30}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>{headerText}</Text>
              {errorText}
              <View style={{marginTop: 20}}>
                <Text style={{marginLeft: 21, marginRight: 21,marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>{text}</Text>
              </View>
              <View style={{marginLeft: 21, marginRight: 21, marginTop: 10}}>
                <FlatList data={lockers} keyExtractor={(item, index) => index.toString()} renderItem={({ item }) => {return this.renderItem(item)}} backgroundColor={'white'}/>
              </View>
            </View>
          </Content>
        </Container>
    );
  }
}

const styles = StyleSheet.create({
  zipCodeInput: {
    marginTop: 20,
    height: 50,
    width: '90%',
    marginLeft: '2.5%',
    paddingLeft: '2.5%',
    fontSize: 16,
    backgroundColor: Colors.white
  },
  background: {
    flex: 1,
    backgroundColor: Colors.white,
    marginTop: 60,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: Theme.primaryColor
  }
});
