/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
/*
Importing the necessary screens to be instantiated as
stack screens
*/
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
            component={loginScreen}
          />
          <Stack.Screen
            name="Home"
            component={homeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={registerScreen}
          />
          <Stack.Screen
            name="Profile"
            component={profileScreen}
          />
          <Stack.Screen
            name="Update Profile"
            component={updateProfile}
          />
          <Stack.Screen
            name="Search"
            component={searchScreen}
          />
          <Stack.Screen
            name="otherProfile"
            component={otherProfileScreen}
          />
          <Stack.Screen
            name="uploadPhoto"
            component={updatePictureScreen}
          />
          <Stack.Screen
            name="friendsList"
            component={friendListScreen}
          />
          <Stack.Screen
            name="friendRequests"
            component={friendRequestsScreen}
          />
          <Stack.Screen
            name="Write a post"
            component={postScreen}
          />
          <Stack.Screen
            name="My posts"
            component={myPosts}
          />
          <Stack.Screen
            name="Edit your post"
            component={editPostScreen}
          />
          <Stack.Screen
            name="My drafts"
            component={myDrafts}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
