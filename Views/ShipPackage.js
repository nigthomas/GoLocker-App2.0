import React, { Component } from 'react';
import { View, ActivityIndicator, Text, TouchableHighlight, Platform, Keyboard, Alert} from 'react-native';
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, Right, ActionSheet, Root, Form, Item, Picker, Label, Input, ListItem, Radio, Toast} from 'native-base';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import ReservationService from '../Services/ReservationService'
import _ from 'underscore'

export default class ShipPackage extends Component {
  constructor(props) {
   super(props);

   this.state = {
     data: null,
     loading: false,
     selected: null,
     smallParcel: false,
     mediumParcel: false,
     largeParcel: false,
     trackingNumber: ""
   };
  }

  componentDidMount() {
    this.setState({loading: true})
  }

  onValueChange (value: String) {
    this.setState({
     selected: value
    });
  }

  reserveLocker () {
    const smallParcelSelected = this.state.smallParcel
    const mediumParcelSelected = this.state.mediumParcel
    const largeParcelSelected = this.state.largeParcel
    const locker = this.props.data
    const lockerId = locker.id
    const trackingNumber = this.state.trackingNumber
    const type = 1
    const accountNumber = null

    if(!smallParcelSelected && !mediumParcelSelected && !largeParcelSelected) {
      Alert.alert('', 'Please choose a package size', [{text: 'OK', style: 'cancel'}], { cancelable: false })
      return
    }

    if(this.state.trackingNumber.length == 0) {
      Alert.alert('', 'Please enter a tracking number to reserve a locker', [{text: 'OK', style: 'cancel'}], { cancelable: false })
      return;
    }

    var parcelSizeCode = null

    if(smallParcelSelected) {
      parcelSizeCode = "S"
    }
    else if (mediumParcelSelected) {
      parcelSizeCode = "M"
    }
    else if (largeParcelSelected) {
      parcelSizeCode = "L"
    }

    if(!parcelSizeCode) {
      return;
    }

    const compartment = _.find(locker.compartmentSizes, (compartment) => {
      return compartment.code === parcelSizeCode
    })

    if(!compartment) {
      return
    }

    Toast.show({text: 'Locker reserved', position: 'bottom', buttonText: 'OK', onClose: this.props.close()})

    return
    ReservationService.createReservation(compartment, accountNumber, type, trackingNumber, lockerId)
    .then(data => {
      Toast.show({text: 'Locker reserved', position: 'bottom', buttonText: 'OK', onClose: this.props.close()})
    })
    .catch(err => {
      AlertView.showConfirmation("Error reserving locker")
    })

  }

  toggleSmallLocker () {
    this.setState({smallParcel: true, mediumParcel: false, largeParcel: false})
  }

  toggleMediumLocker () {
    this.setState({smallParcel: false, mediumParcel: true, largeParcel: false})
  }

  toggleLargeLocker () {
    this.setState({smallParcel: false, mediumParcel: false, largeParcel: true})
  }

  done () {
    Keyboard.dismiss()
    this.reserveLocker()
  }

  render() {
    const style = this.props.style || {}
    const title = (this.props && this.props.data && this.props.data.property) ? "Send a package to " +this.props.data.property.name : ""
    style.justifyContent = 'center'
    style.flex = 1

    return (
      <Root>
        <Container>
          <Header androidStatusBarColor={Theme.secondaryColor} style={{backgroundColor: Theme.primaryColor}}>
            <Left style={{flex: 1}}>
            <TouchableHighlight onPress={() => {this.props.close()}} underlayColor={'transparent'}>
              <Text style={{color: Colors.white, textAlign: 'center'}}>Cancel</Text>
            </TouchableHighlight>
            </Left>
            <Body style={{ flex: 2,  justifyContent: 'center', alignItems: 'center'}}>
              <Title style={{color: Colors.white, fontFamily: Theme.primaryFont}}>Ship a Package</Title>
            </Body>
            <Right style={{flex: 1}}>
              <TouchableHighlight onPress={() => {this.done()}} underlayColor={'transparent'}>
                <Text style={{color: Colors.white, textAlign: 'center'}}>Reserve</Text>
              </TouchableHighlight>
            </Right>
          </Header>
          <Content style={{backgroundColor: Colors.gray_ef}}>
          <Card>
            <Content scrollEnabled={false}>
            <CardItem style={{borderBottomColor: Colors.gray_ef, borderBottomWidth: 1}}>
              <Body>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>{title}</Text>
                <Text style={{fontSize: 14, fontWeight: '300', marginTop: 15}}>Please choose a package size:</Text>
              </Body>
            </CardItem>
              <ListItem>
                <Left>
                <TouchableHighlight onPress={() => {this.toggleSmallLocker()}} underlayColor={'transparent'}>
                  <Text style={{fontSize: 11, color: Colors.gray}}>Small Parcel - No bigger than 4 H x 15 W x 24 L</Text>
                </TouchableHighlight>
                </Left>
                <Right>
                  <Radio selected={this.state.smallParcel}/>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <TouchableHighlight onPress={() => {this.toggleMediumLocker()}} underlayColor={'transparent'}>
                    <Text style={{fontSize: 11, color: Colors.gray}}>Medium Parcel - No bigger than 8 H x 15 W x 24 L</Text>
                  </TouchableHighlight>
                </Left>
                <Right>
                  <Radio selected={this.state.mediumParcel}/>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <TouchableHighlight onPress={() => {this.toggleLargeLocker()}} underlayColor={'transparent'}>
                    <Text style={{fontSize: 11, color: Colors.gray}}>Large Parcel - No bigger than 17 H x 15 W x 25 L</Text>
                  </TouchableHighlight>
                </Left>
                <Right>
                  <Radio selected={this.state.largeParcel} />
                </Right>
              </ListItem>
              <CardItem>
                <Body style={{flex: 1}}>
                  <Text style={{fontSize: 14, fontWeight: '300', marginTop: 15}}>Enter Tracking Number:</Text>
                  <Input style={{color: Colors.gray, fontFamily: Theme.primaryFont, fontSize: 13, paddingLeft: -3, width: 300}} placeholder={"Tracking Number..."} onChangeText={(trackingNumber) => this.setState({trackingNumber: trackingNumber})} value={this.state.trackingNumber}/>
                </Body>
              </CardItem>
            </Content>
           </Card>
          </Content>
      </Container>
    </Root>
    );
  }
}
