import React, { Component } from 'react';
import {
  TouchableOpacity, View, Text, StyleSheet, StatusBar, ScrollView, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TO-DO list for this screen.
// 1. Implement some kind of scroll view (week 3 lab sheet), to scroll through posts
// 2. Posting to an API

class myPosts extends Component {
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
    const id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
      method: 'GET',
      headers: { 'X-Authorization': sessionToken },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((responseJson) => {
        this.setState({
          postArray: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong when trying to gather your posts');
      });
  };

  deletePost = async (postID) => {
    const id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post/${postID}/`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('post successfully deleted!');
          alert('Post succesfully deleted');
          this.props.navigation.navigate('Profile');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  drafts = () => {
    this.props.navigation.navigate('My drafts');
  };

  editPost(postID) {
    console.log(`${postID}yes`);
    this.props.navigation.navigate('Edit your post', {
      post: postID,
    });
  }

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
                      <TouchableOpacity onPress={() => this.editPost(item.post_id)}>
                        <Text style={{
                          fontFamily: 'helvetica', fontSize: 20, color: 'white', lineHeight: 45,
                        }}
                        >
                          Edit post
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.deletePost(item.post_id)}>
                        <Text style={{
                          fontFamily: 'helvetica', fontSize: 20, color: 'red', lineHeight: 45,
                        }}
                        >
                          Delete post
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
          </ScrollView>
        </View>
        <View>
          <TouchableOpacity style={styles.button} onPress={this.drafts}>
            <Text style={{
              fontFamily: 'helvetica', fontSize: 20, color: 'white', lineHeight: 45,
            }}
            >
              My drafts
            </Text>
          </TouchableOpacity>
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

export default myPosts;
