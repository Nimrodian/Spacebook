/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  TouchableOpacity, View, Text, StyleSheet, TextInput, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PostScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postString: '',
    };
  }

  /*This method is used to post a string value to the API from a users
  text input in the JSX below. It is called from the post button on this screen.
  The body of the request is pulled from the state of this class - postString. 
  postString is edited when a user input a string into the text input in the JSX 
  render function below. If the user successfully posts their message they will be
  redirected to their home screen.
  */
  post = async () => {
    const id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
      method: 'POST',
      headers: {
        'X-Authorization': sessionToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: this.state.postString,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          this.props.navigation.navigate('Home');
        } else if (response.status === 401) {
          console.log('yes');
        } else {
          throw 'Something went wrong';
        }
      });
  };

  /*This method is called when the user doesn't want to post their message
  but instead wants to save it as a draft post. This code will set an AsyncStorage
  value with the key - their ID and the value - the string of the text post. Then,
  the user will again, be redirected to their home screen.
  */
  saveDraft = async () => {
    const id = await AsyncStorage.getItem('userID');
    await AsyncStorage.setItem(id, this.state.postString);
    this.props.navigation.navigate('Home');
  };

  //Render function to display the JSX for this Post message screen.
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: '' }}>
          <TextInput
            multiline
            style={styles.textBoxes}
            placeholder="Write your post here"
            placeholderTextColor="silver"
            color="white"
            onChangeText={(postString) => this.setState({ postString })}
            value={this.state.postString}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: '', justifyContent: 'center' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.post}
          >
            <Text style={styles.sillyText}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.saveDraft}
          >
            <Text style={styles.sillyText}>Save as draft</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

//Style sheet created.
const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
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
    width: 365,
    height: 650,
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

export default PostScreen;
