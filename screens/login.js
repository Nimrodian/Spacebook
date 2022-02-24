import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, Pressable, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator, createAppContainer } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { createStackNavigator } from 'react-navigation-stack';
import registerScreen from './register';


export default class loginScreen extends Component {
  //Remember 'props' just stands for properties, if you get a little confused Joe
  constructor(props){
    super(props);
    this.state = {
      emailAddress: "",
      password: ""
    }
  }
  
   login = async () => { 
     console.log(this.state.emailAddress)
     console.log(this.state.password)
     }

   register = () => {
    this.props.navigation.navigate('Register');
   }
   
  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
        // Background Linear Gradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.background}
        />  
        <Image
          source={require('../images/fixedMoon.png')}
          style={{ width: 150, height: 150, marginTop: 425}}/>
        <Text style={styles.welcome}>
          Welcome to SpaceBook™ </Text>
        <View>
          <TextInput 
            style={styles.loginFields} 
            placeholder={'email address'}
            placeholderTextColor='silver'
            onChangeText={(emailAddress) => this.setState({emailAddress})}
            value={this.state.emailAddress}/>
          <TextInput 
            style={styles.loginFields}
            secureTextEntry={true} 
            placeholder={'password'}
            placeholderTextColor='silver'
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}/>
          <View style={{flexDirection: 'row', alignItems: '', justifyContent: 'center'}}>
              <TouchableOpacity style={styles.button}
              onPress={this.login}
              >
                <Text style={{color:'white', fontFamily: 'helvetica'}}>LOGIN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}
              onPress={this.register}
              >
                <Text style={{color:'white', fontFamily: 'helvetica'}}>REGISTER</Text>
              </TouchableOpacity>
          </View>
        </View>
        <View>
            <Image 
            source={require('../images/bigMoon.png')}
            style={{ width: 600, height: 600, flex: 1, marginTop: 60}}/>
        </View>
      </View> 
    );
  }
}

const styles = StyleSheet.create({  
  container: {
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
  loginFields: {
    fontFamily: 'helvetica',
    fontSize: 20,
    borderColor: 'white',
    borderWidth: 2,
    color: 'white',
    textAlign: 'justify',
    lineHeight: 30,
    borderRadius:'12px',
    padding: 8,
    margin: 5,
    width: 300

  },
  welcome: {
    fontFamily: 'helvetica',
    fontSize: 23,
    color: 'white',
    lineHeight: 45,
    borderColor: 'white',
    borderWidth:2,
    borderRadius:'12px',
    backgroundColor: "#1F3366",
    width: 300
  },
  button: {
    alignItems: "center",
    backgroundColor: "#1F3366",
    padding: 10,
    borderColor: 'white',
    borderWidth:2,
    borderRadius:'12px',
    flex: 1,
    margin: 5
  }
})
