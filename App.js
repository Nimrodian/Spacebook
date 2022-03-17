import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import loginScreen from './screens/login';
import homeScreen from './screens/home';
import registerScreen from './screens/register';
import profileScreen from './screens/profile';
import updateProfile from './screens/updateProfile';
import searchScreen from './screens/Search';
import otherProfileScreen from './screens/otherProfile';
import updatePictureScreen from './screens/updatePicture';
import friendListScreen from './screens/friendsList.';
import friendRequestsScreen from './screens/friendRequests';
import postScreen from './screens/Post';
import myPosts from './screens/myPosts';
import editPostScreen from './screens/editPost';
import myDrafts from './screens/draftPosts';

//TO-DO list notes etc
//1. Make it so other screens can not be accessed until the user has
//   been authenticated by logging in.

const Stack = createStackNavigator();

class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4267B2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
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
            name='Profile' 
            component={profileScreen} 
          />
          <Stack.Screen
            name = "Update Profile"
            component={updateProfile}
          />
          <Stack.Screen 
            name = "Search"
            component={searchScreen}
          />
          <Stack.Screen
            name = "otherProfile"
            component = {otherProfileScreen}
          />
          <Stack.Screen 
            name = "uploadPhoto"
            component = {updatePictureScreen}
          />
          <Stack.Screen 
            name = "friendsList"
            component = {friendListScreen}
          />
          <Stack.Screen
            name = "friendRequests"
            component = {friendRequestsScreen}
          />
          <Stack.Screen
            name = "Write a post"
            component = {postScreen}
          />
          <Stack.Screen
            name = "My posts"
            component = {myPosts}
          />
          <Stack.Screen
            name = "Edit your post"
            component = {editPostScreen}
          />
          <Stack.Screen
            name = "My drafts"
            component = {myDrafts}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
}

export default App;