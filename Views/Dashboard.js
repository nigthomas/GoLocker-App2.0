import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, Platform} from 'react-native';
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab} from 'native-base';
import FooterTabWithNavigation from './FooterTabWithNavigation'
import Colors from '../Common/Colors'
import Theme from '../Common/Theme'

export default class DashboardView extends Component {
  static navigationOptions = { title: 'Dashboard', header: null, tabBarVisible: false};

  render() {
    return (
      <Container>
        <Header androidStatusBarColor={Theme.secondaryColor} style={{backgroundColor: Theme.primaryColor}}>
          <Body>
            <Title style={{color: Colors.white}}>Dashboard</Title>
          </Body>
        </Header>
        <Content>
          <Card style={{flex: 0}}>
            <CardItem>
              <Left>
                <Body>
                  <Text>NativeBase</Text>
                  <Text note>April 15, 2016</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  //Your text here
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="logo-github" />
                  <Text>1,926 stars</Text>
                </Button>
              </Left>
            </CardItem>
          </Card>
        </Content>

        <FooterTabWithNavigation navigation={this.props.navigation} active={"dashboard"}/>
      </Container>
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
  },
  footer: {
    ...Platform.select({
      android: {
        backgroundColor: Theme.primaryColor,
      }
    })
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
