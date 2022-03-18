/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  TextInput, View, Text, StyleSheet, StatusBar, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
    };
  }

  register = async () => fetch(
    'http://localhost:3333/api/1.0.0/user/',
    {
      method: 'POST',
      headers: {
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
      if (response.status === 201) {
        return response.json();
      }
      if (response.status === 400) {
        throw 'Account already exists';
      } else {
        throw 'Something unknown went wrong';
      }
    })
    .then((responseJson) => {
      console.log('User created with ID: ', responseJson);
      this.props.navigation.navigate('Login');
    })
    .catch((error) => {
      console.log(error);
      alert('Account already exists');
    });

  goBack = () => {
    this.props.navigation.navigate('Login');
  };

  registerCheck = () => {
    if (this.state.firstName === '' || this.state.lastName === '') {
      alert('Please enter data into all fields.');
      this.props.navigation.navigate('Register');
    } else {
      this.register();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          // Background Linear Gradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          style={styles.background}
        />
        <View>
          <Text style={styles.sillyText}>
            Create a new account
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
            onPress={this.registerCheck}
          >
            <Text style={styles.sillyText}>Register</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={this.goBack}
          >
            <Text style={{ fontFamily: 'helvetica', color: 'white', margin: 5 }}>Already have an account?</Text>
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

export default RegisterScreen;
