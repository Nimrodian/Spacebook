/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  TouchableOpacity, View, Text, StyleSheet, StatusBar, ScrollView, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postArray: [],
    };
  }

  //When screen is mounted (upon login) then method is called to get list of users friends.
  async componentDidMount() {
    this.getFriends();
  }

  //Method to loop through users friend list (retrieved with 'getFriends') and get all their posts.
  //Where they are appended to an array of all posts from all users friends.
  getAllPosts = async (response) => {
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    let allPosts = [];

    for (let i = 0; i < response.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await fetch(`http://localhost:3333/api/1.0.0/user/${response[i].user_id}/post`, {
        method: 'GET',
        headers: { 'X-Authorization': sessionToken },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((responseJson) => {
          for (let i = 0; i < responseJson.length; i++) {
            allPosts.push(responseJson[i]);
          }
        })
        .catch((error) => {
          console.log(error);
          alert('Something went wrong while trying to get your friends posts');
        });
    }
    //Here the array of posts is sorted by date (descending) so newest posts from friends 
    //appear first on a users homepage. The new state is then set to the class.
    allPosts = allPosts.sort((y, x) => new Date(x.timestamp) - new Date(y.timestamp));
    this.setState({
      postArray: allPosts,
    });
  };

  //Logout method, simplest endpoint. Called when logout button is pressed.
  logout = async () => {
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch(
      'http://localhost:3333/api/1.0.0/logout',
      {
        method: 'POST',
        headers: {
          'X-Authorization': sessionToken,
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('Logout successful');
          this.props.navigation.navigate('Login');
        }
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong whilst trying to log you out!');
      });
  };

  //Method called upon mount to get a list of users friends, with the response
  //JSON being passed to the getAllPosts method to retrieve all posts from all users.
  getFriends = async () => {
    const id = await AsyncStorage.getItem('userID');
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
          return response.json();
        }
        if (response.status === 401) {
          throw 'something went wrong';
        }
      })
      .then((responseJson) => {
        this.getAllPosts(responseJson);
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong while trying to get your friend list');
      });
  };

  //Method to navigate user to their profile page when they click the profile button.
  myProfile = () => {
    this.props.navigation.navigate('Profile');
  };

  //Method to navigate the user to the search box when they click the search button.
  search = () => {
    this.props.navigation.navigate('Search');
  };

  //Method to navigate a user to the write a post page, when they click the post button.
  post = async () => {
    this.props.navigation.navigate('Write a post');
  };

  /*Method to let a user like a post, fetch works as any other. When the user presses the like
  post button under a post, the id of that post along with the id of the user who posted it is 
  passed to this method, where the API call is made. The clickable posts are stored in a 
  flatlist in render.
  */
  likePost = async (userID, postID) => {
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }
    return fetch(`http://localhost:3333/api/1.0.0/user/${userID}/post/${postID}/like`, {
      method: 'POST',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          alert('Post Liked');
        } else {
          console.log('You have already liked this post');
          alert('You have already liked this post');
        }
      })
      .catch((error) => {
        console.log(error);
        alert('You have already liked this post');
      });
  };

  //Same as the likePost method above, except the API call method is DELETE, rather than 
  //POST.
  dislikePost = async (userID, postID) => {
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }
    return fetch(`http://localhost:3333/api/1.0.0/user/${userID}/post/${postID}/like`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          alert('Removed Like');
        }
      })
      .catch((error) => {
        console.log(error);
        alert('You have not previously liked this post');
      });
  };

  //Render the JSX for this screen. Note the two buttons that are displayed for each 
  //element of the flatlist.
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: '', justifyContent: 'center' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.logout}
          >
            <Text style={styles.sillyText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.myProfile}
          >
            <Text style={styles.sillyText}>My profile</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: '', justifyContent: 'center' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.search}
          >
            <Text style={styles.sillyText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.post}
          >
            <Text style={styles.sillyText}>Write a post</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 680, width: 440, padding: 20 }}>
          <ScrollView style={styles.scrollView}>
            <FlatList
              keyExtractor={(item) => item.post_id}
              data={this.state.postArray}
              renderItem={({ item }) => (
                <View style={{ alignItems: 'row' }}>
                  <Text
                    style={styles.item}
                  >
                    {item.author.first_name}
                    {': '}
                    {item.text}
                    {'\n'}
                    {'Date: '}
                    {item.timestamp}
                    {'\n'}
                    {'Like count: '}
                    {item.numLikes}
                  </Text>
                  <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.likePost(item.author.user_id, item.post_id)}>
                      <Text style={{
                        fontFamily: 'helvetica', fontSize: 20, color: 'green', lineHeight: 45,
                      }}
                      >
                          Like
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.dislikePost(item.author.user_id, item.post_id)}>
                      <Text style={{
                        fontFamily: 'helvetica', fontSize: 20, color: 'red', lineHeight: 45,
                      }}
                      >
                          Remove like
                      </Text>
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

//style sheet created.
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
  item: {
    marginTop: 24,
    padding: 30,
    backgroundColor: '#1F3366',
    fontSize: 24,
    color: 'white',
  },
});

export default HomeScreen;
