import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, TextInput, StatusBar, ScrollView, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeColors } from 'react-navigation';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

//TO-DO list for this screen.
//1. Implement some kind of scroll view (week 3 lab sheet), to scroll through posts 
//2. Posting to an API

class searchScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
        searchString : "",
        searchResult: [],
        profileID: ""
    }
  }

  search =  async () =>{
      let id = await AsyncStorage.getItem('userID');
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

      return fetch("http://localhost:3333/api/1.0.0/search?search_in=all&q="+this.state.searchString , {
        method: 'GET',
        headers: {
            'X-Authorization': sessionToken
        },
        params: {
            'q':this.state.searchString,
            'search_in':'friends'
        }
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
        this.setState({
            searchResult: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong while trying to retrive your search, please try again');
      })
    }

    actionOnRow = async (item) => {
        let id = await AsyncStorage.getItem('userID');
        this.setState({
            profileID: item.user_id
        })
        console.log('Selected user ID: ', this.state.profileID);
        if(this.state.profileID == id){
          this.props.navigation.navigate('Profile');
        }
        else{
          this.props.navigation.navigate('otherProfile', {
            profileID: this.state.profileID
        });
      }
    }

    render(){
      return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: '', justifyContent: 'center'}}>
                <TextInput 
                    style={styles.textBoxes} 
                    placeholder={'Search'}
                    placeholderTextColor='silver'
                    color='white'
                    onChangeText={(searchString) => this.setState({searchString})}
                    value={this.state.searchString}
                    
                />
                <TouchableOpacity
                  onPress={this.search}>
                  <Text style={styles.sillyText}>Go</Text>
                </TouchableOpacity>
            </View>
            <View style={{height: 680, width: 440, padding: 20}}>
                <ScrollView style={styles.scrollView}>
                    <FlatList
                        keyExtractor={(item) => item.user_id}
                        data = {this.state.searchResult}
                        renderItem={({ item }) => (
                        <TouchableWithoutFeedback onPress={ () => this.actionOnRow(item)}>
                            <View>
                                <Text 
                                style={styles.item}>
                                {item.user_id} {" "} {item.user_givenname} {" "} {item.user_familyname}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
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

export default searchScreen;
