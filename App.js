import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import { LoginView } from './Views/Login'
import { DashboardView } from './Views/Dashboard'
import { Storage } from './Common/Storage'

const LoginNavigationController = StackNavigator({
  LoginView: { screen: LoginView },
  DashboardView: {screen: DashboardView}
});

const AnonymousNavigationController = StackNavigator({
  DashboardView: {screen: DashboardView}
});

//
// class App extends Component {
//     render(){
//         if (this.props.userLogged == true ){
//             return (
//                 <RootNavLogged/>
//             )
//         } else {
//             return(
//                 <RootNav/>
//             )
//         }
//     }
// }

export default LoginNavigationController
