import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import LoginView from './Views/Login'
import RegistrationView from './Views/Registration'
import DashboardView from './Views/Dashboard'
import SplashView from './Views/Splash'
import Storage from './Common/Storage'
import LoginService from './Services/LoginService'

const LoginNavigationController = StackNavigator({
  LoginView: { screen: ({ navigation }) => {
    return <LoginView rootNavigation={{ navigate: navigation }} />
  }},
  DashboardView: {screen: DashboardView},
  RegistrationView: {screen: RegistrationView}
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
 });

const NavigationController = StackNavigator({
  DashboardView: {screen: DashboardView}
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isLoggedIn: false
     }
    }

    componentDidMount() {
      LoginService.logOut()
      LoginService.isLoggedIn()
      .then(isLoggedIn => {
        this.setState({isLoggedIn: isLoggedIn, loading: false})
      })
      .catch(err => {
        this.setState({isLoggedIn: false, loading: false})
      })
    }

    render() {
      if(this.state.loading){
        return <SplashView/>
      }

      if(this.state.isLoggedIn) {
        return <NavigationController/>
      }

      return <LoginNavigationController/>
    }
}

export default App;
