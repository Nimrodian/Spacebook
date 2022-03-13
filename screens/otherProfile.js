import React, { Component } from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { RotateInUpLeft } from 'react-native-reanimated';
import { NativeScreenNavigationContainer } from 'react-native-screens';
import { NavigationContext } from 'react-navigation';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';

//JOE MAKE SURE TO PROPERLY READ UP ON ASHES VERSION IF DIDMOUNT ETC. https://github.com/ash-williams/expo-week3-lecture-demos/blob/master/async-storage/components/login.js

class otherProfile extends Component {
    state = {
        firstName: null,
        lastName: null,
        email: null,
        friendCount: null,
        profilePicture: null,
        profileID: ""
    }


    componentDidMount (){
        this.getData();
        this.getProfilePic();
        this.setState({
          profileID: this.props.route.params.profileID
        })
        console.log(this.props.route.params.profileID);
        //console.log(profileID);
    }

    getData = async () => {
        //let id = await AsyncStorage.getItem('userID');
        let id = this.props.route.params.profileID;
        let sessionToken = await AsyncStorage.getItem('token');

        if(sessionToken != null){
            sessionToken = sessionToken.replaceAll('"', '');
          }
          else{
            return null;
          }

        this.setState({
            userID: id, 
            token: sessionToken
        })

        return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
            method: 'GET',
            headers: {
                'X-Authorization': sessionToken
            }
        })
        .then((response) => {
            if(response.status == 200){
                return response.json()
            }
            else if(response.status == 401){
                this.props.navigation.navigate("Login");
            }
            else {
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            if(responseJson != undefined){
                this.setState({
                    firstName: responseJson.first_name,
                    lastName: responseJson.last_name,
                    email: responseJson.email,
                    friendCount: responseJson.friend_count
                })
                console.log(responseJson);
                console.log(this.state.firstName);
            }
        })
    }

    getFriendList = async () => {
      console.log("Worked");
      console.log(this.state.profileID);
      this.props.navigation.navigate('friendsList', {
        profileID: this.state.profileID  
      });
    }

    getProfilePic = async () => {
        //let id = await AsyncStorage.getItem('userID');
        let id = this.props.route.params.profileID;

        let sessionToken = await AsyncStorage.getItem('token');
  
        if(sessionToken != null){
          sessionToken = sessionToken.replaceAll('"', '');
        }
        else{
          return null;
        }
  
        this.setState({
          userID: id, 
          token: sessionToken
        })
        return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
          method: 'GET',
          headers: {
              'X-Authorization': sessionToken
          }
      })
      .then((res) => {
        return res.blob();
      })
      .then((resBlob) => {
        let pic = URL.createObjectURL(resBlob);
        this.setState({
          profilePicture: pic
        })
      })
      }

    addAsFriend = async () => {
      let id = this.props.route.params.profileID;
      let sessionToken = await AsyncStorage.getItem('token');

      if(sessionToken != null){
        sessionToken = sessionToken.replaceAll('"', '');
      }
      else{
        return null;
      }

      return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/friends",{
          method: 'POST',
          headers: {
            'X-Authorization': sessionToken
          }
        })
      .then((response) =>{
        if(response.status == 201){
          console.log("Request submitted");
        }
        else if(response.status == 403){
          console.log("You have already requested to add this user as a friend.");
        }
      })
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
                <Image 
                  source={{uri: this.state.profilePicture,}}
                  style={styles.image}/>
              </View>
              <View>
                  <Text style={styles.capitaliseNames}> 
                  {this.state.firstName} {""}
                  {this.state.lastName}
                  </Text>
              </View>
              <View>
                  <Text style={styles.sillyText}> 
                  {this.state.email}
                  </Text>
              </View>
              <View>
                <TouchableOpacity onPress={this.getFriendList}>
                  <Text style={styles.sillyText}> 
                  Friends: {""} {this.state.friendCount}
                  </Text>
                </TouchableOpacity>  
              </View>
              <View style={{flexDirection: 'row', alignItems: '', justifyContent: 'center'}}>
                  <TouchableOpacity
                    onPress={this.addAsFriend}
                    style={styles.button}>
                    <Text style={styles.textBoxes}>Add as friend</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.backHome}
                    style={styles.button}>
                    <Text style={styles.textBoxes}>View {""} {this.state.firstName} {"'s posts"}</Text>
                  </TouchableOpacity>
              </View>
            </View>
          );
        }  
}

const styles = StyleSheet.create({ 
    scrollView: {
      backgroundColor: "#1F3366",
      marginHorizontal: 20,
      borderColor: 'white',
      borderWidth: 2,
      borderRadius:'20px'
    },
    image: {
      width: 150,
      height: 150,
      borderRadius: 150 / 2,
      overflow: "hidden",
      borderWidth: 4,
      borderColor: "white",
      marginBottom: 20
    },
    capitaliseNames: {
      textTransform: 'capitalize',
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
      width: 310,
      margin: 5
    },
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
      width: 310,
      margin: 5
    },
    textBoxes: {
      alignItems: "center",
      padding: 10,
      flex: 1,
      margin: 3,
      color: 'white', 
      width: 125,
      fontFamily: 'helvetica',
      textAlign: 'center'
    },
    button: {
        alignItems: "center",
        padding: 5,
        flex: 1,
        margin: 5,
        backgroundColor: "#1F3366",
        borderColor: 'white',
        borderWidth:2,
        borderRadius:'12px',
      }
  })

export default otherProfile;
