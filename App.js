import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import loginScreen from './screens/login';
import homeScreen from './screens/home';
import registerScreen from './screens/register';
import logoutScreen from './screens/logout';
import profileScreen from './screens/profile';


//TO-DO list notes etc
//1. Make it so other screens can not be accessed until the user has
//   been authenticated by logging in.

const Stack = createStackNavigator();

class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Login" 
            component={loginScreen} 
          />
          <Stack.Screen 
            name="Home" 
            component={homeScreen} 
            options={{headerShown: false}}
          />
          <Stack.Screen 
            name='Register' 
            component={registerScreen} 
          />
          <Stack.Screen 
            name='Logout' 
            component={logoutScreen} 
          />
          <Stack.Screen 
            name='Profile' 
            component={profileScreen} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
}

export default App;