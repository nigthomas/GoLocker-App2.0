import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, Platform} from 'react-native';
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab} from 'native-base';
import Octicon from 'react-native-vector-icons/dist/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'
import Theme from '../Common/Theme'
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome'

export default class FooterTabWithNavigation extends Component {

  onHomePress = () => {
    this.props.navigation.navigate('Home')
  }

  onIncomingPress = () => {
    this.props.navigation.navigate('Incoming')
  }

  onShipPress = () => {
    this.props.navigation.navigate('Ship')
  }

  onDetailsPress = () => {
    this.props.navigation.navigate('Details')
  }

  render() {
    const homeStyle = this.props.active == "home" ? styles.iconSelected : styles.icon
    const shipStyle = this.props.active == "ship" ? styles.iconSelected : styles.icon
    const incomingStyle = this.props.active == "incoming" ? styles.iconSelected : styles.icon
    const detailsStyle = this.props.active == "details" ? styles.iconSelected : styles.icon

    const homeTextStyle = this.props.active == "home" ? styles.activeText : styles.text
    const shipTextStyle = this.props.active == "ship" ? styles.activeText : styles.text
    const incomingTextStyle = this.props.active == "incoming" ? styles.activeText : styles.text
    const detailsTextStyle = this.props.active == "details" ? styles.activeText : styles.text

    return (
      <Footer style={{borderTopWidth: 0, backgroundColor: Colors.white}}>
       <FooterTab style={styles.footer}>
       <Button vertical onPress={this.onHomePress}>
         <FontAwesome name="compass" size={22} style={homeStyle}/>
         <Text style={homeTextStyle}>Home</Text>
       </Button>
         <Button vertical onPress={this.onIncomingPress}>
           <FontAwesome name="th-list" size={20} style={incomingStyle}/>
           <Text style={incomingTextStyle}>Incoming</Text>
         </Button>
         <Button vertical onPress={this.onShipPress}>
           <FontAwesome name="send" size={20} style={shipStyle} />
           <Text style={shipTextStyle}>Ship</Text>
         </Button>
         <Button vertical onPress={this.onDetailsPress}>
           <MaterialCommunityIcons name="account-box-outline" size={20} style={detailsStyle}/>
           <Text style={detailsTextStyle}>Details</Text>
         </Button>
       </FooterTab>
     </Footer>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    fontFamily: Theme.primaryFont,
    marginTop: 3
  },
  activeText: {
    fontSize: 10,
    fontFamily: Theme.primaryFont,
    marginTop: 3,
    fontWeight: '600' //Semi-bold
  },
  icon: {
    ...Platform.select({
      ios: {
        color: Colors.gray
      },
      android: {
        color: Colors.gray
      }
    })
  },
  iconSelected: {
    ...Platform.select({
      ios: {
        color: Colors.black
      },
      android: {
        color: Colors.black
      }
    })
  },
  footer: {
    ...Platform.select({
      android: {
        backgroundColor: Colors.white,
      },
      ios: {
        backgroundColor: Colors.white
      }
    })
  }
});
