import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import Theme from '../Common/Theme'
import Colors from '../Common/Colors'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, List, ListItem, Separator} from 'native-base';

export default class AccountView extends Component {
  static navigationOptions = { title: 'Account', header: null, tabBarVisible: false };

  onLogoutPress = () => {

  }

  render() {
    return (
      <Container>
        <Header androidStatusBarColor={Theme.secondaryColor} style={{backgroundColor: Theme.primaryColor}}>
          <Body>
            <Title style={{color: Colors.white, fontFamily: Theme.primaryFont}}>Account</Title>
          </Body>
        </Header>
        <Content>
        <List>
          <Separator bordered style={styles.headerStyle}>
            <Text style={styles.textStyle}>BILLING</Text>
          </Separator>
          <ListItem style={styles.itemStyle}>
            <Text style={styles.textStyle}>Address</Text>
          </ListItem>
          <ListItem style={styles.itemStyle}>
            <Text style={styles.textStyle}>Payment Info</Text>
          </ListItem>
          <Separator bordered style={styles.headerStyle}>
            <Text style={styles.textStyle}>MEMBERSHIP</Text>
          </Separator>
          <ListItem style={styles.itemStyle}>
            <Text style={styles.textStyle}>Plan</Text>
          </ListItem>
          <Separator bordered style={styles.headerStyle}>
            <Text style={styles.textStyle}>PROFILE</Text>
          </Separator>
          <ListItem style={styles.itemStyle}>
            <Text style={styles.textStyle}>Phone</Text>
          </ListItem>
          <ListItem style={styles.itemStyle}>
            <Text style={styles.textStyle}>Mailing Address</Text>
          </ListItem>
          <Separator bordered style={styles.headerStyle}>
          </Separator>
          <ListItem style={styles.itemStyle}>
            <Text style={styles.textStyle}>Change Password</Text>
          </ListItem>
          <ListItem style={styles.itemStyle}>
            <Text style={styles.textStyle}>Terms</Text>
          </ListItem>
          <ListItem style={styles.itemStyle}>
            <Text style={styles.textStyle}>Privacy</Text>
          </ListItem>
            <ListItem style={styles.itemStyle} onPress={this.onLogoutPress}>
              <Text style={styles.textStyle}>Logout</Text>
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
  },
  textStyle: {
    fontFamily: Theme.primaryFont
  }
});
