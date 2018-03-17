import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Theme from '../Common/Theme'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab} from 'native-base';

export default class PackagesView extends Component {
  static navigationOptions = { title: 'Packages', header: null, tabBarVisible: false };

  render() {
    return (
      <Container>
        <Header androidStatusBarColor={Theme.secondaryColor} style={{backgroundColor: Theme.primaryColor}}>
          <Body>
            <Title style={{color: Colors.white}}>Packages</Title>
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

        <FooterTabWithNavigation navigation={this.props.navigation} active={"package"}/>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.primaryColor
  },
});
