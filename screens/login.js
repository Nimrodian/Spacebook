import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TextInput, Image, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: '',
      password: '',
    };
  }

  /*Method to log user in, called when login button pressed.
  Body of request is pulled from entry fields.
  */
  login = async () => fetch(
    'http://localhost:3333/api/1.0.0/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.state.emailAddress,
        password: this.state.password,
      }),
    },
  )
  /*if request is OK, return responseJson. From there the ID and Auth token are stored 
  in AsyncStorage. User is then navigated to the home screen once successfully logged in
  */
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      if (response.status === 400) {
        throw 'Failed validation';
      } else {
        throw 'Something went wrong';
      }
    })
    .then(async (responseJson) => {
      //Setting the ID and Auth token in AsyncStorage for future use.
      await AsyncStorage.setItem('userID', JSON.stringify(responseJson.id));
      await AsyncStorage.setItem('token', JSON.stringify(responseJson.token));
    })
    .then(() => {
      this.search();
      this.props.navigation.navigate('Home');
    })
    .catch((error) => {
      console.log(error);
      alert('Please enter valid login credentials');
    });

  search = async () => {
    const id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
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
          this.props.navigate('Login');
          console.log('yes');
        } else {
          throw 'Something went wrong';
        }
      });
  };

  //Method to navigate user to registration page when register button is pressed.
  register = () => {
    this.props.navigation.navigate('Register');
  };

  //render function to display Apps JSX.
  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          style={styles.background}
        />
        <Image
          source={require('../images/fixedMoon.png')}
          style={{ width: 150, height: 150, marginTop: 175 }}
        />
        <Text style={styles.welcome}>
          Welcome to SpaceBook™
          {' '}

        </Text>
        <View>
          <TextInput
            style={styles.loginFields}
            placeholder="email address"
            placeholderTextColor="silver"
            onChangeText={(emailAddress) => this.setState({ emailAddress })}
            value={this.state.emailAddress}
          />
          <TextInput
            style={styles.loginFields}
            secureTextEntry
            placeholder="password"
            placeholderTextColor="silver"
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
          />
          <View style={{ flexDirection: 'row', alignItems: '', justifyContent: 'center' }}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.login}
            >
              <Text style={{ color: 'white', fontFamily: 'helvetica' }}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={this.register}
            >
              <Text style={{ color: 'white', fontFamily: 'helvetica' }}>REGISTER</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Image
            source={require('../images/bigMoon1.png')}
            style={{ width: 920, height: 180, marginTop: 60 }}
          />
        </View>
      </View>
    );
  }
}

//Style sheet created.
const styles = StyleSheet.create({
  container: {
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
  loginFields: {
    fontFamily: 'helvetica',
    fontSize: 20,
    borderColor: 'white',
    borderWidth: 2,
    color: 'white',
    textAlign: 'justify',
    lineHeight: 30,
    borderRadius: '12px',
    padding: 8,
    margin: 5,
    width: 300,

  },
  welcome: {
    fontFamily: 'helvetica',
    fontSize: 23,
    color: 'white',
    lineHeight: 45,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: '12px',
    backgroundColor: '#1F3366',
    width: 300,
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
  },
});
