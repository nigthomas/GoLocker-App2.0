import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, List, ListItem, Separator} from 'native-base';

export default class AccountView extends Component {
  static navigationOptions = { title: 'Account', header: null, tabBarVisible: false };

  onLogoutPress = () => {
    console.log("Logout")
  }

  render() {
    return (
      <Container>
        <Header androidStatusBarColor={Theme.secondaryColor} style={{backgroundColor: Theme.primaryColor}}>
          <Body>
            <Title style={{color: Colors.white}}>Account</Title>
          </Body>
        </Header>
        <Content>
        <List>

          <Separator bordered style={styles.headerStyle}>
            <Text>BILLING</Text>
          </Separator>
          <ListItem style={styles.itemStyle}>
            <Text>Address</Text>
          </ListItem>
          <ListItem style={styles.itemStyle}>
            <Text>Payment Info</Text>
          </ListItem>
          <Separator bordered style={styles.headerStyle}>
            <Text>MEMBERSHIP</Text>
          </Separator>
          <ListItem style={styles.itemStyle}>
            <Text>Plan</Text>
          </ListItem>
          <Separator bordered style={styles.headerStyle}>
            <Text>PROFILE</Text>
          </Separator>
          <ListItem style={styles.itemStyle}>
            <Text>Phone</Text>
          </ListItem>
          <ListItem style={styles.itemStyle}>
            <Text>Mailing Address</Text>
          </ListItem>
          <Separator bordered style={styles.headerStyle}>
          </Separator>
          <ListItem style={styles.itemStyle}>
            <Text>Password</Text>
          </ListItem>
          <ListItem style={styles.itemStyle}>
            <Text>Terms</Text>
          </ListItem>
          <ListItem style={styles.itemStyle}>
            <Text>Privacy</Text>
          </ListItem>
            <ListItem style={styles.itemStyle} onPress={this.onLogoutPress}>
              <Text>Logout</Text>
            </ListItem>
          </List>
        </Content>

        <FooterTabWithNavigation navigation={this.props.navigation} active={"account"}/>
      </Container>
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
  }
});
