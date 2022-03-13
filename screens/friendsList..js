import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, TextInput, StatusBar, ScrollView, SafeAreaView, FlatList, TouchableNativeFeedbackBase } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class friendListScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
        searchResult: [],
        profileID: "",
        areFriends: false
    }
  }

  componentDidMount (){
    this.friendSearch();
    console.log(this.props.route.params.profileID);
  }

  friendSearch =  async () =>{
      let id = this.props.route.params.profileID;
      //let id = await AsyncStorage.getItem('userID');
      let sessionToken = await AsyncStorage.getItem('token');
      console.log(id);
      console.log(sessionToken);
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

      return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/friends",{
          method: 'GET',
          headers: {
              'X-Authorization': sessionToken
          }
      })
      .then((response) => {
        if(response.status == 200){
            this.setState({
                areFriends: true
            })
          return response.json()
        }
        else{
            this.setState({
                areFriends: false
            })
        }
      })
      .then((responseJson) => {
        console.log("this worked ", responseJson);
        this.setState({
            searchResult: responseJson
        })
      })
    }

    render(){
        if(this.state.areFriends == true){
            return (
                    <View style={styles.container}>
                        <View style={{height: 700, width: 440, padding: 20}}>
                            <ScrollView style={styles.scrollView}>
                                <FlatList
                                    keyExtractor={(item) => item.user_id}
                                    data = {this.state.searchResult}
                                    renderItem={({ item }) => (
                                        <View>
                                            <Text 
                                            style={styles.item}>
                                            {item.user_id} {" "} {item.user_givenname} {" "} {item.user_familyname}
                                            </Text>
                                        </View>
                                        )}
                                    />
                            </ScrollView>
                        </View>
                    </View>
                )}
        else{
            return(
                <View style={styles.container}>
                    <View style={{height:700, width: 440, padding: 20}}>
                        <Text style={styles.sillyText}>Sorry, you can not view this users friends. They must be your friend, or friends with one of your friends.</Text>
                    </View>
                </View>
            )
        }
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
      flex: 1,
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
      textAlign: 'center'
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

export default friendListScreen;