import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//JOE MAKE SURE TO PROPERLY READ UP ON ASHES VERSION IF DIDMOUNT ETC. https://github.com/ash-williams/expo-week3-lecture-demos/blob/master/async-storage/components/login.js

const getProfileData = async(done) => {
    try {
        const jsonValue = await AsyncStorage.getItem('user_details')
        const data = JSON.parse(jsonValue);
        return done(data);   
    }
    catch(e){
        console.error(e);
    }
}


class profileScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            userInfo: {}
        }
    }
    
    //   test = async () => {
    //     let id = await AsyncStorage.getItem('userID');
    //     let sessionToken = await AsyncStorage.getItem('token');
    
    //     if(sessionToken != null){
    //       sessionToken = sessionToken.replaceAll('"', '');
    //     }
    //     else{
    //       return null;
    //     }
    
    //     return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
    //       method: 'GET',
    //       headers: {
    //         'X-Authorization': sessionToken
    //       }
    //     })
    //     .then((response) => {
    //       if(response.status == 200){
    //         this.setState({
    //             userInfo: responseJson.user_id
    //         })  
    //         return response.json()
    //       }
    //       else if(response.status == 401){
    //         this.props.navigate('Login')
    //         console.log("yes");
    //       }
    //       else{
    //         throw 'Something went wrong';
    //       }
    //     })
    //     .then((responseJson) => {
    //       console.log("this worked ", responseJson, "woooo");
    //     })
    //   }

    render(){
      return (
        <View>
          <View>
          <ScrollView>
            <Text> 
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

            {this.state.userInfo.user_id}





            </Text>
            <TouchableOpacity onPress={this.test}>
                <Text>
                    button
                </Text>
            </TouchableOpacity>
          </ScrollView>
          </View>
        </View>
      );
    } 
}

export default profileScreen;
