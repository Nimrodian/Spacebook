/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  TextInput, View, Text, StyleSheet, StatusBar, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TO-DO list for this screen.
// 1. Implement some kind of scroll view (week 3 lab sheet), to scroll through posts
// 2. Posting to an API

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
    };
  }

  updateProfile = async () => {
    const id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${id}`,
      {
        method: 'PATCH',
        headers: {
          'X-Authorization': sessionToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          email: this.state.emailAddress,
          password: this.state.password,
        }),
      },
    )
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate('Profile');
        } else if (response.status === 400) {
          alert('Something went wrong when trying to update your profile');
        }
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong when trying to update your profile');
      });
  };

  updatePicture = () => {
    this.props.navigation.navigate('uploadPhoto');
  };

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          style={styles.background}
        />
        <View>
          <Text style={styles.sillyText}>
            Update your profile information
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: '', justifyContent: 'center' }}>
          <TextInput
            style={styles.textBoxes}
            placeholder="First name"
            placeholderTextColor="silver"
            color="white"
            onChangeText={(firstName) => this.setState({ firstName })}
            value={this.state.firstName}
          />
          <TextInput
            style={styles.textBoxes}
            placeholder="Surname(s)"
            placeholderTextColor="silver"
            color="white"
            onChangeText={(lastName) => this.setState({ lastName })}
            value={this.state.lastName}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: '', justifyContent: 'center' }}>
          <TextInput
            style={styles.textBoxes}
            placeholder="email address"
            placeholderTextColor="silver"
            color="white"
            onChangeText={(emailAddress) => this.setState({ emailAddress })}
            value={this.state.emailAddress}
          />
          <TextInput
            style={styles.textBoxes}
            secureTextEntry
            placeholder="password"
            placeholderTextColor="silver"
            color="white"
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={this.updateProfile}
          >
            <Text style={styles.sillyText}>Save</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={this.updatePicture}
          >
            <Text style={styles.sillyText}>Upload a profile picture</Text>
          </TouchableOpacity>
        </View>
        <View />
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
    width: 150,
    fontFamily: 'helvetica',
  },
});

export default UpdateProfile;
