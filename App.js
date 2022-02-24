import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import loginScreen from './screens/login';
import homeScreen from './screens/home';
import registerScreen from './screens/register';

//TO-DO list notes etc
//1. Make it so other screens can not be accessed until the user has
//   been authenticated by logging in.

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Login" component={loginScreen} />
          <Drawer.Screen name="Home" component={homeScreen} />
          <Drawer.Screen name='Register' component={registerScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
  
}

export default App;