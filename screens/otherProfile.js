/* eslint-disable constructor-super */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  TouchableOpacity, View, Image, Text, StyleSheet, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import 'react-native-gesture-handler';

//This whole class is very similar to that of the 'Profile' Screen 
//with a few minor differences in buttons available to the end user.
class OtherProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      friendCount: null,
      profilePicture: null,
      profileID: '',
    };
  }

  /*On component mount, call the getData method, and the getProfilePic method.
  Since this is a profile different to the user that is logged in. The profileID
  string is initially set to the profileID passed through to this component. Seen 
  under the method calls below.
  */
  componentDidMount() {
    this.getData();
    this.getProfilePic();
    this.setState({
      profileID: this.props.route.params.profileID,
    });
  }

  /*This method is the first called and is used to populate the profile fields seen
  in the constructor above. Once the GET request for the user information has been OK'd
  this.setState will be used to update the name/email/etc fields of the user, to be 
  displayed in the JSX in the render function below.
  */
  getData = async () => {
    const id = this.props.route.params.profileID;
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

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
        if (response.status == 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        if (responseJson !== undefined) {
          //This is where the responseJson is parsed and used to set the 
          //state of the users information.
          this.setState({
            firstName: responseJson.first_name,
            lastName: responseJson.last_name,
            email: responseJson.email,
            friendCount: responseJson.friend_count,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong trying to retrieve this users information');
      });
  };

  //This method is called when the logged in user wants to view the friends list
  //of this user. It will navigate the end-user to the friends list screen, passing
  //along the ID of the profile page they have selected.
  getFriendList = async () => {
    this.props.navigation.navigate('friendsList', {
      profileID: this.state.profileID,
    });
  };

  //Method to get the profile pic of the user, similar to the getData method above.
  getProfilePic = async () => {
    const id = this.props.route.params.profileID;
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
        const pic = URL.createObjectURL(resBlob);
        //Here the profilePicture is set in the constructor to whatever picture 
        //is returned by the API
        this.setState({
          profilePicture: pic,
        });
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong trying to retrieve this users profile picture');
      });
  };

  /*This method is called when the user tries to add this profile as a friend,
  the POST request is made with the ID of the current page.
  */
  addAsFriend = async () => {
    const id = this.props.route.params.profileID;
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`, {
      method: 'POST',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 201) {
          console.log('Request submitted');
        } else if (response.status === 403) {
          console.log('You have already requested to add this user as a friend.');
          alert('You have already requested to add this user as a friend or you are already friends');
        }
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong trying to add this user as a friend');
      });
  };

  //This method is called when the logged in user presses the view posts button
  //which will navigate them to the 'friends posts' screen, passing along the profileID
  //of whichever user they are looking at.
  viewPosts = async () => {
    this.props.navigation.navigate('Friends posts', {
      profileID: this.state.profileID,
    });
  };

  //Render function to display the JSX of this other profile screen.
  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
              // Background Linear Gradient
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
          <TouchableOpacity onPress={this.getFriendList}>
            <Text style={styles.sillyText}>
              Friends:
              {' '}

              {' '}
              {this.state.friendCount}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: '', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={this.addAsFriend}
            style={styles.button}
          >
            <Text style={styles.textBoxes}>Add as friend</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.viewPosts}
            style={styles.button}
          >
            <Text style={styles.textBoxes}>
              View
              {' '}

              {' '}
              {this.state.firstName}
              {' '}
              's posts
            </Text>
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

export default OtherProfile;
