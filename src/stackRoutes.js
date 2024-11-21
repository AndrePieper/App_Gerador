import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';
import Home from './pages/Home/index';
import Login from './pages/Login/index';
import Gerador from './pages/QrCode/gerador';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Gerador" component={Gerador}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
