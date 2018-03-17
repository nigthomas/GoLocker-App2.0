import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, Platform} from 'react-native';
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab} from 'native-base';
import Octicon from 'react-native-vector-icons/dist/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'
import Theme from '../Common/Theme'

export default class FooterTabWithNavigation extends Component {
  onCompassPress = () => {
    this.props.navigation.navigate('Dashboard')
  }

  onPackagePress = () => {
    this.props.navigation.navigate('Packages')
  }

  onAccountPress = () => {
    this.props.navigation.navigate('Account')
  }

  render() {
    const compassStyle = this.props.active == "dashboard" ? styles.iconSelected : styles.icon
    const packageStyle = this.props.active == "package" ? styles.iconSelected : styles.icon
    const accountStyle = this.props.active == "account" ? styles.iconSelected : styles.icon

    return (
      <Footer>
       <FooterTab style={styles.footer}>
         <Button onPress={this.onCompassPress}>
           <MaterialCommunityIcons name="compass-outline" size={30} style={compassStyle}/>
         </Button>
         <Button onPress={this.onPackagePress}>
           <MaterialCommunityIcons active name="package-variant-closed" size={30} style={packageStyle} />
         </Button>
         <Button onPress={this.onAccountPress}>
           <MaterialIcons name="person-outline" size={30} style={accountStyle}/>
         </Button>
       </FooterTab>
     </Footer>
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
  }
});
