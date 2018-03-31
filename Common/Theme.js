import { Platform } from 'react-native';

export default Theme = {
  primaryColor: "#5fab2c",
  secondaryColor: "#474e58",
  primaryFont: Platform.OS === 'ios' ? "System" : "Helvetica"
}
