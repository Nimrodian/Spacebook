/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
/*
Importing the necessary screens to be instantiated as
stack screens
*/
import LoginScreen from './screens/login';
import HomeScreen from './screens/home';
import RegisterScreen from './screens/register';
import ProfileScreen from './screens/profile';
import UpdateProfile from './screens/updateProfile';
import SearchScreen from './screens/Search';
import OtherProfileScreen from './screens/otherProfile';
import UpdatePictureScreen from './screens/updatePicture';
import FriendListScreen from './screens/friendsList.';
import FriendRequestsScreen from './screens/friendRequests';
import PostScreen from './screens/Post';
import MyPosts from './screens/myPosts';
import EditPostScreen from './screens/editPost';
import MyDrafts from './screens/draftPosts';
import FriendPosts from './screens/friendPosts';

//Creating stack navigator (main navigation for app)
const Stack = createStackNavigator();

/*App class instantiated to render the stack navigator
and it's screens. Returning the Stack, and it's styling
shown below.

Each Stack screen takes a value of name, for which it 
is called upon, and it's component, where the screen
pulls in the file (imported at the top of this file).
*/
class App extends Component {
  render() {
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
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
          />
          <Stack.Screen
            name="Update Profile"
            component={UpdateProfile}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
          />
          <Stack.Screen
            name="otherProfile"
            component={OtherProfileScreen}
          />
          <Stack.Screen
            name="uploadPhoto"
            component={UpdatePictureScreen}
          />
          <Stack.Screen
            name="friendsList"
            component={FriendListScreen}
          />
          <Stack.Screen
            name="friendRequests"
            component={FriendRequestsScreen}
          />
          <Stack.Screen
            name="Write a post"
            component={PostScreen}
          />
          <Stack.Screen
            name="Posts"
            component={MyPosts}
          />
          <Stack.Screen
            name="Edit your post"
            component={EditPostScreen}
          />
          <Stack.Screen
            name="My drafts"
            component={MyDrafts}
          />
          <Stack.Screen
            name='Friends posts'
            component={FriendPosts}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
