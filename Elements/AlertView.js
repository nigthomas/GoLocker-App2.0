import { Alert, Platform } from 'react-native';
import { Toast } from 'native-base';

export default AlertView = {
  showConfirmation: (title, message) => {
    if(Platform.OS === 'ios') {
      Alert.alert(title, message,[{text: 'OK', onPress: () => {}}],{ cancelable: false })
      return
    }

    const toastMessage = (message) ? message : title
    Toast.show({text: toastMessage, position: 'bottom', buttonText: 'OK'})
  }
}
