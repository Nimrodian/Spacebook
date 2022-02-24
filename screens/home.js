import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView } from 'react-native';

//TO-DO list for this screen.
//1. Implement some kind of scroll view (week 3 lab sheet), to scroll through posts 
//2. Posting to an API

class homeScreen extends Component {
    render(){
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.sillyText}> 
            worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            worked worked worked worked worked worked
            
            </Text>
          </ScrollView>
        </SafeAreaView>
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
    }
  })

export default homeScreen;
