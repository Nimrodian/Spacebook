/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  TouchableOpacity, View, Text, StyleSheet,
  StatusBar, ScrollView, TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TO-DO list for this screen.
// 1. Implement some kind of scroll view (week 3 lab sheet), to scroll through posts
// 2. Posting to an API

class myDrafts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draft: '',
      isDraft: false,
    };
  }

  async componentDidMount() {
    this.getDrafts();
  }

  getDrafts = async () => {
    const id = await AsyncStorage.getItem('userID');
    const draftPost = await AsyncStorage.getItem(id);

    if (draftPost !== null) {
      this.setState({
        draft: draftPost,
        isDraft: true,
      });
    }
  };

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
        text: this.state.draft,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log('successfully posted!');
          this.deleteDraft();
        // this.props.navigation.navigate('Home');
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

  deleteDraft = async () => {
    console.log('draft removed from storage');
    const id = await AsyncStorage.getItem('userID');
    await AsyncStorage.removeItem(id);
    this.props.navigation.navigate('Home');
  };

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

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    // justifyContent: 'center',
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

export default myDrafts;
