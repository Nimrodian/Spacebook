/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  TouchableOpacity, View, Text, StyleSheet,
  StatusBar, ScrollView, TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
here the class component is instantiated for the user to view their
draft posts. The constructor takes in props, to allow the screen to 
use the Stack navigation used throughout the application. It also
sets the state of draft (the text of the draft selected) and 
isDraft, which is set to true or false, depending on if a draft is 
present or not.
*/

class MyDrafts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draft: '',
      isDraft: false,
    };
  }

  /*
  Built-in function 'componentDidMount' that is automatically called
  when a component (this screen in this case) is mounted (called). 
  This just means the screen is automatically populated with the draft
  posts upon mounting, since the function primarily calls the 'getDrafts()
  method.
  */
  async componentDidMount() {
    this.getDrafts();
  }

  /*method (called in mount) to await AsyncStorage and retrieves the draft
  post associated with the user ID of the currently logged in user.
  */
  getDrafts = async () => {
    const id = await AsyncStorage.getItem('userID');
    const draftPost = await AsyncStorage.getItem(id);

    /*Checks if the draft post value in storage is null, if not then set
    the value in state, to the draft post string. So it can be posted or deleted.
    */
    if (draftPost !== null) {
      this.setState({
        draft: draftPost,
        isDraft: true,
      });
    }
  };


  /*Post function that posts the draft if the user selects the post draft button
  works like all other API requests in this app. Body of the request is 
  the draft string pulled from the state of this class (set in 'getDrafts')
  */
  post = async () => {
    const id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    /*
    This if statement is very hacky, for some reason I could not get a fetch 
    request to work without replacing the ' with a " in the sessionToken. It is 
    poor practice I know, but that is my explanation for its prescence.
    */
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
        text: this.state.draft,
      }),
    })
    /*If response is OK, then draft has been posted with above fetch, and is
    subsequently deleted from the Async storage, by calling the deleteDraft
    method below. Else, show an error alert and catch the error.
    */
      .then((response) => {
        if (response.status === 201) {
          console.log('successfully posted!');
          this.deleteDraft();
        } else if (response.status === 401) {
          console.log('yes');
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong when trying to post your draft');
      });
  };

  //Delete draft function for if the user either posts or deletes the draft.
  deleteDraft = async () => {
    console.log('draft removed from storage');
    const id = await AsyncStorage.getItem('userID');
    await AsyncStorage.removeItem(id);
    this.props.navigation.navigate('Home');
  };

  /*This is a conditional render function. If there is a draft in storage, 
  it will display the first return block, with the contents of the draft,
  if not - it will display a simple screen stating there are no drafts.
  */
  render() {
    if (this.state.isDraft === true) {
      return (
        <View style={styles.container}>
          <View style={{ height: 700 }}>
            <TextInput
              multiline
              style={styles.textBoxes}
              color="white"
              onChangeText={(draft) => this.setState({ draft })}
              value={this.state.draft}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: '', justifyContent: 'center' }}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.post}
            >
              <Text style={styles.sillyText}>Post draft</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={this.deleteDraft}
            >
              <Text style={styles.sillyText}>Delete draft</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={{ height: 760, width: 440, padding: 20 }}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.sillyText}>
              You do not have a draft post saved.
            </Text>
          </ScrollView>
        </View>
      </View>
    );
  }
}

//Style sheet created with all the necessary styles for this screen.

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

export default MyDrafts;
