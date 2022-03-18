import React, { Component } from 'react';
import {
  View, Text, StyleSheet, StatusBar, ScrollView, FlatList, TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResult: [],
      profileID: '',
      areFriends: false,
    };
  }

  //Upon screen mounting, friendSearch method is called.
  componentDidMount() {
    this.friendSearch();
  }

  //Async Method to retrieve a users friend list so it can be rendered in the
  //Flatlist in the render function. 
  friendSearch = async () => {
    const id = this.props.route.params.profileID;
    let sessionToken = await AsyncStorage.getItem('token');
    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          //Sets the areFriends value to true if the call is OK
          //Because if it's okay, then the user logged in should be 
          //able to see this users friends.
          this.setState({
            areFriends: true,
          });
          return response.json();
        }

        this.setState({
          areFriends: false,
        });
      })
      .then((responseJson) => {
        this.setState({
          searchResult: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /*Method to be called when a flatlist item is selected.
  If selected, the item selected is passed into this method,
  where the id of the item is stored and then the user is 
  navigated to the appropriate user profile they have chosen.
  */
  actionOnRow = async (item) => {
    const id = await AsyncStorage.getItem('userID');
    this.setState({
      profileID: item.user_id,
    });
    console.log('Selected user ID: ', this.state.profileID);
    if (this.state.profileID === id) {
      this.props.navigation.navigate('Profile');
    } else {
      this.props.navigation.navigate('otherProfile', {
        profileID: this.state.profileID,
      });
    }
  };

  /*Render function to display the JSX of this friends list screen
  With a flatlist to display their list of friends. If the logged in
  user is friends with the user selected then it will display their friends
  list, if not they will be greeted with a simple messaged informing them
  they can not view this users friends (as per Spacebook rules).
  */
  render() {
    if (this.state.areFriends === true) {
      return (
        <View style={styles.container}>
          <View style={{ height: 765, width: 440, padding: 20 }}>
            <ScrollView style={styles.scrollView}>
              <FlatList
                keyExtractor={(item) => item.user_id}
                data={this.state.searchResult}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback onPress={() => this.actionOnRow(item)}>
                    <View>
                      <Text
                        style={styles.item}
                      >
                        {item.user_id}
                        {' '}
                        {' '}
                        {' '}
                        {item.user_givenname}
                        {' '}
                        {' '}
                        {' '}
                        {item.user_familyname}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              />
            </ScrollView>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={{ height: 700, width: 440, padding: 20 }}>
          <Text style={styles.sillyText}>
            Sorry, you can not view
            this users friends. They must be your friend, or friends with one of your friends.
          </Text>
        </View>
      </View>
    );
  }
}

//style sheet initialised.
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
    flex: 1,
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
    textAlign: 'center',
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

export default FriendListScreen;
