import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import LoginView from './Views/Login'
import RegistrationView from './Views/Registration'
import ShipView from './Views/Ship'
import DetailsView from './Views/Details'
import IncomingView from './Views/Incoming'
import SplashView from './Views/Splash'
import SelectLockerView from './Views/SelectLocker'
import ForgotPasswordView from './Views/ForgotPassword'
import ResetPasswordView from './Views/ResetPassword'
import Storage from './Common/Storage'
import LoginService from './Services/LoginService'
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import NewUpdateBillingAddress from './Views/NewUpdateBillingAddress'
import NewUpdateMailingAddress from './Views/NewUpdateMailingAddress'
import NewUpdatePaymentMethod from './Views/NewUpdatePaymentMethod'
import ChangePassword from './Views/ChangePassword'
import OptionSelector from './Views/OptionSelector'
import ChangePlan from './Views/ChangePlan'

const IncomingNavigationController = StackNavigator({
  IncomingView: { screen: IncomingView }
});

const ShipNavigationController = StackNavigator({
  ShipView: { screen: ShipView },
  SelectLockerView: {screen: SelectLockerView}
});

const DetailsNavigationController = StackNavigator({
  DetailsView: { screen: DetailsView },
  NewUpdateBillingAddress: {screen: NewUpdateBillingAddress},
  NewUpdatePaymentMethod: {screen: NewUpdatePaymentMethod},
  NewUpdateMailingAddress: {screen: NewUpdateMailingAddress},
  ChangePassword: {screen: ChangePassword},
  OptionSelector: {screen: OptionSelector},
  ChangePlan: {screen: ChangePlan}
});

const TabController = TabNavigator({
   Incoming: { screen: IncomingNavigationController },
   Ship: { screen: ShipNavigationController },
   Details: { screen: DetailsNavigationController }
}, {
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
  IncomingView: {screen: TabController},
  RegistrationView: {screen: RegistrationView},
  ForgotPasswordView: {screen: ForgotPasswordView},
  ResetPasswordView: {screen: ResetPasswordView}
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
 });

const NavigationController = StackNavigator({
  IncomingView: {screen: TabController}
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
