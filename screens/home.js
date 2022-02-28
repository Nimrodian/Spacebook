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
  
    render(){
      return (
        <View style={styles.container}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.button}
                onPress={this.logout}>
                  <Text style={{color:'white', fontFamily: 'helvetica'}}>Logout</Text>
            </TouchableOpacity>
            <Text style={styles.sillyText}>
              This also worked
            </Text>
          </View>
          <View>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.sillyText}> 
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked
            worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked
            worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked
            worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
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
      backgroundColor: 'blue',
      marginHorizontal: 20
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
      backgroundColor: "#1F3366"
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

export default homeScreen;
