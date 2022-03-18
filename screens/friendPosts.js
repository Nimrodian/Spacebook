/* eslint-disable no-else-return */
/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  TouchableOpacity, View, Text, StyleSheet, StatusBar, ScrollView, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TO-DO list for this screen.
// 1. Implement some kind of scroll view (week 3 lab sheet), to scroll through posts
// 2. Posting to an API

class friendPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postArray: [],
    };
  }

  async componentDidMount() {
    this.getAllPosts();
  }

  getAllPosts = async () => {
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${this.props.route.params.profileID}/post`, {
      method: 'GET',
      headers: { 'X-Authorization': sessionToken },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          alert('You can not view the posts of a user you are not friends with');
          this.props.navigation.navigate('Search');
        }
      })
      .then((responseJson) => {
        this.setState({
          postArray: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong when trying to gather your friends posts');
      });
  };

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

  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 700, width: 440, padding: 20 }}>
          <ScrollView style={styles.scrollView}>
            <View>
              <FlatList
                keyExtractor={(item) => item.post_id}
                data={this.state.postArray}
                renderItem={({ item }) => (
                  <View style={{ alignItems: 'row' }}>
                    <Text
                      style={styles.item}
                    >
                      {'Post: '}
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
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

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

export default friendPosts;
