import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView } from 'react-native';
import { Assets } from 'react-navigation-stack';

export default class logoutScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            token: ''
        }
    }

    
    checkLoggedIn = async () => {
        //let sessionToken = await AsyncStorage.getItem('token');
        const sessionToken = await AsyncStorage.getItem('token');
        if(sessionToken != null){
            console.log("logout partially working");
            console.log(sessionToken);
            this.props.navigation.navigate('Home');
        }
        else{
            return null
        }
    }
    
    
    // render(){
    //     return (
    //         this.checkLoggedIn()
    //     );
    //   } 
}

