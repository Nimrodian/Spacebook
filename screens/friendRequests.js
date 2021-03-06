/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  TouchableOpacity, View, Text, StyleSheet, StatusBar, ScrollView, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequestsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResult: [],
    };
  }

  //On screen mount, the search method is called.
  componentDidMount() {
    this.search();
  }

  /*This method is automatically ran through componentDidMount.
  And it essentially just performs an API GET request to see if the
  logged in user has any incoming friend requests. If so, they will 
  be stored in the searchResult array (initialised in the class constructor).
  */
  search = async () => {
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
          console.log('yes');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        //the response list of requests is set into the array to 
        //display in the JSX render function
        this.setState({
          searchResult: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
        alert('You have no friend requests');
      });
  };

  /*When a user selects the button to accept a friend request 
  this method is called, with the id of the friend being passed into
  this method. From here a POST request is made to the API to accept
  the request. If OK, user is directed back to their profile page.
  */
  acceptRequest = async (id) => {
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'POST',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Successfully accepted!');
          alert('Request accepted');
          this.props.navigation.navigate('Profile');
        } else if (response.status === 401) {
          console.log('something went wrong when trying to accept this friend request');
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong when trying to accept this friend request');
      });
  };

  /*This method works the exact same as the acceptRequest method, however it is a 
  delete request and will also direct the user back to their profile screen.
  */
  rejectRequest = async (id) => {
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Successfully rejected!');
          alert('Request declined');
          this.props.navigation.navigate('Profile');
        } else if (response.status === 401) {
          console.log('yes');
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong when trying to decline this friend request');
      });
  };

  //Render function to display the JSX of the friend request screen
  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 765, width: 440, padding: 20 }}>
          <ScrollView style={styles.scrollView}>
            <FlatList
              keyExtractor={(item) => item.user_id}
              data={this.state.searchResult}
              renderItem={({ item }) => (
                <View style={{ alignItems: 'row' }}>
                  <Text
                    style={styles.item}
                  >
                    {item.user_id}
                    {' '}
                    {' '}
                    {' '}
                    {item.first_name}
                    {' '}
                    {' '}
                    {' '}
                    {item.last_name}
                  </Text>
                  <View style={{ alignItems: 'row' }}>
                    <TouchableOpacity onPress={() => this.acceptRequest(item.user_id)}>
                      <Text style={styles.sillyText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.rejectRequest(item.user_id)}>
                      <Text style={styles.sillyText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}

//Style sheet initialised.
const styles = StyleSheet.create({
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
  scrollView: {
    backgroundColor: '#1F3366',
    marginHorizontal: 20,
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
    fontSize: 20,
    color: 'white',
    lineHeight: 45,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#1F3366',
    padding: 10,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: '12px',
    flex: 1,
    margin: 5,
    width: 175,
  },
  textBoxes: {
    alignItems: 'center',
    padding: 10,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: '12px',
    flex: 1,
    margin: 5,
    color: 'white',
    width: 300,
    fontFamily: 'helvetica',
    marginTop: 20,
    fontSize: 20,
    lineHeight: 45,
  },
  item: {
    marginTop: 24,
    padding: 30,
    backgroundColor: '#1F3366',
    fontSize: 24,
    color: 'white',
  },
});

export default FriendRequestsScreen;
