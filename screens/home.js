import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//TO-DO list for this screen.
//1. Implement some kind of scroll view (week 3 lab sheet), to scroll through posts 
//2. Posting to an API

class homeScreen extends Component {
  constructor(props){
    super(props);
  }

  logout = async () => {

    let sessionToken = await AsyncStorage.getItem('token');

    this.setState({
      token: sessionToken 
    })

    if(sessionToken != null){
      sessionToken = sessionToken.replaceAll('"', '');
    }
    else{
      return null;
    }

    return fetch('http://localhost:3333/api/1.0.0/logout', 
    {
      method: 'POST',
      headers: {
        'X-Authorization': sessionToken
      }
    })
    .then((response) => {
      if(response.status == 200){
        console.log("Logout successful");
        this.props.navigation.navigate('Login');
      }
    })
  }

  myProfile = () => {
    this.props.navigation.navigate('Profile')
  }

    render(){
      return (
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: '', justifyContent: 'center'}}>
            <TouchableOpacity style={styles.button}
                onPress={this.logout}>
                  <Text style={styles.sillyText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={this.myProfile}>
                  <Text style={styles.sillyText}>My profile</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 750, width: 440, padding: 20}}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.sillyText}> 
            Lorem ipsum dolor sit amet, consectetur 
            adipiscing elit, sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip 
            ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit 
            esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non 
            proident, sunt in culpa qui officia deserunt 
            mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur 
            adipiscing elit, sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip 
            ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit 
            esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non 
            proident, sunt in culpa qui officia deserunt 
            mollit anim id est laborum.
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
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4267B2',
      borderColor: 'white',
      borderWidth: 2,
      borderRadius:'20px'
    },
    scrollView: {
      backgroundColor: "#1F3366",
      marginHorizontal: 20,
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
      fontSize: 20,
      color: 'white',
      lineHeight: 45,
      //borderColor: 'white',
      //borderWidth:2,
      //borderRadius:'12px',
      //backgroundColor: "#1F3366"
    },
    button: {
    alignItems: "center",
    backgroundColor: "#1F3366",
    padding: 10,
    borderColor: 'white',
    borderWidth:2,
    borderRadius:'12px',
    flex: 1,
    margin: 5,
    width: 175
  }
  })

export default homeScreen;
