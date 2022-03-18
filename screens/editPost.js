import React, { Component } from 'react';
import {
  TouchableOpacity, View, Text, StyleSheet, TextInput, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditPostScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postString: '',
    };
  }

  componentDidMount() {
    this.getPost();
  }

  getPost = async () => {
    const id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post/${this.props.route.params.post}`, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((responseJson) => {
        this.setState({
          postString: responseJson.text,
        });
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong while trying to retrieve your post to edit');
      });
  };

  editPost = async () => {
    const id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post/${this.props.route.params.post}`, {
      method: 'PATCH',
      headers: {
        'X-Authorization': sessionToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: this.state.postString,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate('Profile');
        }
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong while trying to edit your post');
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: '' }}>
          <TextInput
            multiline
            style={styles.textBoxes}
            color="white"
            onChangeText={(postString) => this.setState({ postString })}
            value={this.state.postString}
          />
        </View>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={this.editPost}
          >
            <Text style={styles.sillyText}>Save post</Text>
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

export default EditPostScreen;
