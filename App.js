import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import LoginView from './Views/Login'
import RegistrationView from './Views/Registration'
import DashboardView from './Views/Dashboard'
import AccountView from './Views/Account'
import PackagesView from './Views/Packages'
import SplashView from './Views/Splash'
import Storage from './Common/Storage'
import LoginService from './Services/LoginService'
import Ionicons from 'react-native-vector-icons/MaterialIcons';

const TabController = TabNavigator({
   Dashboard: { screen: DashboardView },
   Packages: { screen: PackagesView },
   Account: { screen: AccountView }
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Dashboard') {
        iconName = 'home';
      } else if (routeName === 'More') {
        iconName = `ios-options${focused ? '' : '-outline'}`;
      } else if (routeName === 'Settings') {
        iconName = `ios-settings${focused ? '' : '-outline'}`;
      }

      return <Ionicons name={iconName} size={25} color={tintColor} />;
    },
  }),
  tabBarComponent: TabBarBottom,
   tabBarPosition: 'bottom',
   animationEnabled: false,
   swipeEnabled: false,
   tabBarTextFontFamily: 'Avenir-Medium'
});

const LoginNavigationController = StackNavigator({
  LoginView: { screen: ({ navigation }) => {
    return <LoginView rootNavigation={{ navigate: navigation }} />
  }},
  DashboardView: {screen: TabController},
  RegistrationView: {screen: RegistrationView}
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
 });

const NavigationController = StackNavigator({
  DashboardView: {screen: TabController}
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
