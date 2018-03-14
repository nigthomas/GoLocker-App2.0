import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import { LoginView } from './Views/Login'
import { DashboardView } from './Views/Dashboard'
import { SplashView } from './Views/Splash'
import { Storage } from './Common/Storage'
import { LoginService } from './Services/LoginService'

const LoginNavigationController = StackNavigator({
  LoginView: { screen: LoginView },
  DashboardView: {screen: DashboardView}
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
