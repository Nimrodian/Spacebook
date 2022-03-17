import React, { Component } from 'react';
import { TextInput, View, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

//TO-DO list for this screen.
//1. Implement some kind of scroll view (week 3 lab sheet), to scroll through posts 
//2. Posting to an API

class registerScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email_address: "",
      password: "",
    }
  }

  register = async ()  => {
    return fetch('http://localhost:3333/api/1.0.0/user/',
    {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email_address,
        password: this.state.password
    })
    })

    .then((response) =>{
      if(response.status == 201){
        return response.json()
      }
      else if(response.status == 400){
        throw 'Account already exists';
      }
      else{
        throw 'Something unknown went wrong';
      }
    })
    .then((responseJson) =>{
      console.log('User created with ID: ', responseJson);
      this.props.navigation.navigate('Login');
    })
    .catch((error) =>{
      console.log(error)
      alert('Account already exists');
    })
  }

  goBack = () => {
    this.props.navigation.navigate('Login');
  }

  registerCheck = () =>{
    if(this.state.first_name == "" || this.state.last_name == ""){
      alert('Please enter data into all fields.');
      this.props.navigation.navigate('Register');
    }
    else{
      this.register();
    }
  }

  render(){
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
          <View style={{flexDirection: 'row', alignItems: '', justifyContent: 'center'}}>
              <TextInput 
                style={styles.textBoxes} 
                placeholder={'First name'}
                placeholderTextColor='silver'
                color='white'
                onChangeText={(first_name) => this.setState({first_name})}
                value={this.state.first_name}
                />
              <TextInput 
                style={styles.textBoxes}
                placeholder={'Surname(s)'}
                placeholderTextColor='silver'
                color='white'
                onChangeText={(last_name) => this.setState({last_name})}
                value={this.state.last_name}
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: '', justifyContent: 'center'}}>
              <TextInput 
                style={styles.textBoxes} 
                placeholder={'email address'}
                placeholderTextColor='silver'
                color='white'
                onChangeText={(email_address) => this.setState({email_address})}
                value={this.state.email_address}
                />
              <TextInput 
                style={styles.textBoxes}
                secureTextEntry={true} 
                placeholder={'password'}
                placeholderTextColor='silver'
                color='white'
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                />
              </View>
              <View>
                <TouchableOpacity
                  onPress={this.registerCheck}>
                  <Text style={styles.sillyText}>Register</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                onPress={this.goBack}>
                  <Text style={{fontFamily: 'helvetica', color: 'white', margin: 5}}>Already have an account?</Text>
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
      borderRadius:'20px'
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
      borderWidth:2,
      borderRadius:'12px',
      backgroundColor: "#1F3366",
      alignItems: 'center',
      textAlign: 'center',
      width: 310
    },
    textBoxes: {
      alignItems: "center",
      padding: 10,
      borderColor: 'white',
      borderWidth:2,
      borderRadius:'12px',
      flex: 1,
      margin: 5,
      color: 'white', 
      width: 150,
      fontFamily: 'helvetica'
    }
  })

export default registerScreen;
