/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  TouchableOpacity, View, Image, Text, StyleSheet, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      friendCount: null,
      profilePicture: null,
      userID: null,
      token: null,
    };
  }

  /*When screen is mounted, two methods are called to get the data of the logged in 
  user. getProfilePic (for profile picture) and getData for the rest of user info needed.
  */
  componentDidMount() {
    this.getData();
    this.getProfilePic();
  }

  //Method to retrieve the user information of the logged in member. The API call response body
  //Is then used to set the state of the class so it can be displayed in the JSX render
  //Function below.
  getData = async () => {
    const id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    this.setState({
      userID: id,
      token: sessionToken,
    });

    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userID}`, {
      method: 'GET',
      headers: {
        'X-Authorization': this.state.token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
          //If error, take user back to login page, as they are no longer safely authorised.
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        if (responseJson != undefined) {
          this.setState({
            firstName: responseJson.first_name,
            lastName: responseJson.last_name,
            email: responseJson.email,
            friendCount: responseJson.friend_count,
          });
        }
      });
  };

  //Method to get the profile pic of the user, similar to the getData method above.
  getProfilePic = async () => {
    const id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        //resBlob object is then set in the state as the picture file.
        const pic = URL.createObjectURL(resBlob);
        this.setState({
          profilePicture: pic,
        });
      });
  };

  //Method to navigate user to update their profile page, when update button is clicked
  updateProfile = () => {
    this.props.navigation.navigate('Update Profile');
  };

  //Method to navigate the user back to the home screen.
  backHome = () => {
    this.props.navigation.navigate('Home');
  };

  //Method to navigate the user to their friends list page, taking their ID as a param.
  friendsList = async () => {
    const id = await AsyncStorage.getItem('userID');

    this.props.navigation.navigate('friendsList', {
      profileID: id,
    });
  };

  //Method to navigate a user to the page showing their friend requests.
  friendRequests = async () => {
    console.log('friend requests button');
    this.props.navigation.navigate('friendRequests');
  };

  //Method to navigate a user to the page showing all of their posts.
  myPosts = async () => {
    this.props.navigation.navigate('Posts');
  };

  //Render function for this screen to show the JSX below.
  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          style={styles.background}
        />
        <View>
          <Image
            source={{ uri: this.state.profilePicture }}
            style={styles.image}
          />
        </View>
        <View>
          <Text style={styles.capitaliseNames}>
            {this.state.firstName}
            {' '}

            {this.state.lastName}
          </Text>
        </View>
        <View>
          <Text style={styles.sillyText}>
            {this.state.email}
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={this.friendsList}>
            <Text style={styles.sillyText}>
              Friends:
              {' '}

              {' '}
              {this.state.friendCount}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={this.friendRequests}>
            <Text style={styles.sillyText}>
              My friend requests
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={this.myPosts}>
            <Text style={styles.sillyText}>
              My posts
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: '', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={this.updateProfile}
            style={styles.button}
          >
            <Text style={styles.textBoxes}>Update my profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.backHome}
            style={styles.button}
          >
            <Text style={styles.textBoxes}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

//Style sheet initialised.
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#1F3366',
    marginHorizontal: 20,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: '20px',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 20,
  },
  capitaliseNames: {
    textTransform: 'capitalize',
    fontFamily: 'helvetica',
    fontSize: 23,
    color: 'white',
    lineHeight: 45,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: '12px',
    backgroundColor: '#1F3366',
    alignItems: 'center',
    textAlign: 'center',
    width: 310,
    margin: 5,
  },
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4267B2',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: '20px',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  sillyText: {
    fontFamily: 'helvetica',
    fontSize: 23,
    color: 'white',
    lineHeight: 45,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: '12px',
    backgroundColor: '#1F3366',
    alignItems: 'center',
    textAlign: 'center',
    width: 310,
    margin: 5,
  },
  textBoxes: {
    alignItems: 'center',
    padding: 10,
    flex: 1,
    margin: 3,
    color: 'white',
    width: 125,
    fontFamily: 'helvetica',
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    padding: 5,
    flex: 1,
    margin: 5,
    backgroundColor: '#1F3366',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: '12px',
  },
});

export default ProfileScreen;
