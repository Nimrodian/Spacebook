import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, TextInput, StatusBar, ScrollView, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeColors } from 'react-navigation';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

//TO-DO list for this screen.
//1. Implement some kind of scroll view (week 3 lab sheet), to scroll through posts 
//2. Posting to an API

class friendRequestsScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
        searchResult: [],
        profileID: "",
    }
  }

  componentDidMount(){
      this.search();
  }

  search =  async () =>{
      console.log("worked yes boy");
      let id = await AsyncStorage.getItem('userID');
      let sessionToken = await AsyncStorage.getItem('token');

      if(sessionToken != null){
        sessionToken = sessionToken.replaceAll('"', '');
      }
      else{
        return null;
      }

      return fetch("http://localhost:3333/api/1.0.0/friendrequests" , {
        method: 'GET',
        headers: {
            'X-Authorization': sessionToken
        },
    })
    .then((response) => {
        if(response.status == 200){
          return response.json()
        }
        else if(response.status == 401){
          console.log("yes");
        }
        else{
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        console.log("this worked ", responseJson);
        this.setState({
            searchResult: responseJson
        })
      })
    }

    acceptRequest = async (id) => {
      console.log("accepted");
      //let id = await AsyncStorage.getItem('userID');
      let sessionToken = await AsyncStorage.getItem('token');

      if(sessionToken != null){
        sessionToken = sessionToken.replaceAll('"', '');
      }
      else{
        return null;
      }

      return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+id , {
        method: 'POST',
        headers: {
            'X-Authorization': sessionToken
        },
    })
    .then((response) => {
        if(response.status == 200){
          console.log("Successfully accepted!");
        }
        else if(response.status == 401){
          console.log("yes");
        }
        else{
          throw 'Something went wrong';
        }
      })
    }

    rejectRequest = async (id) => {
      console.log("rejected");
      //let id = await AsyncStorage.getItem('userID');
      let sessionToken = await AsyncStorage.getItem('token');

      if(sessionToken != null){
        sessionToken = sessionToken.replaceAll('"', '');
      }
      else{
        return null;
      }

      return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+id , {
        method: 'DELETE',
        headers: {
            'X-Authorization': sessionToken
        },
    })
    .then((response) => {
        if(response.status == 200){
          console.log("Successfully rejected!");
        }
        else if(response.status == 401){
          console.log("yes");
        }
        else{
          throw 'Something went wrong';
        }
      })
    }

    render(){
      return (
        <View style={styles.container}>
            <View style={{height: 765, width: 440, padding: 20}}>
                <ScrollView style={styles.scrollView}>
                    <FlatList
                        keyExtractor={(item) => item.user_id}
                        data = {this.state.searchResult}
                        renderItem={({ item }) => (
                          <View style={{alignItems: 'row'}}>
                                <Text 
                                style={styles.item}>
                                {item.user_id} {" "} {item.first_name} {" "} {item.last_name}
                                </Text>
                                <View style={{alignItems: 'row'}}>
                                  <TouchableOpacity onPress={() => this.acceptRequest(item.user_id)}>
                                    <Text style={styles.sillyText}>Accept</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={() => this.rejectRequest(item.user_id)}>
                                    <Text style={styles.sillyText}>Decline</Text>
                                  </TouchableOpacity>
                                </View>
                          </View>
                            )}
                        />
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
    width: 300,
    fontFamily: 'helvetica',
    marginTop: 20,
    fontSize: 20,
    lineHeight: 45
  },
  item: {
      marginTop: 24,
      padding: 30,
      backgroundColor: '#1F3366',
      fontSize: 24,
      color: 'white'
  }
  })

export default friendRequestsScreen;
