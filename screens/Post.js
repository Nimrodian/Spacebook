import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, TextInput, StatusBar, ScrollView, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeColors } from 'react-navigation';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

class postScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
        postString: "",
        profileID: "",
    }
  }

  post =  async () =>{
      console.log("worked yes boy");
      console.log(this.state.postString);
      let id = await AsyncStorage.getItem('userID');
      let sessionToken = await AsyncStorage.getItem('token');

      if(sessionToken != null){
        sessionToken = sessionToken.replaceAll('"', '');
      }
      else{
        return null;
      }

      return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post" , {
        method: 'POST',
        headers: {
            'X-Authorization': sessionToken,
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            text : this.state.postString
        })
    })
    .then((response) => {
        if(response.status == 201){
          this.props.navigation.navigate('Home');
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
            <View style={{flexDirection: 'row', alignItems: ''}}>
                <TextInput 
                    multiline
                    style={styles.textBoxes} 
                    placeholder={'Write your post here'}
                    placeholderTextColor='silver'
                    color='white'
                    onChangeText={(postString) => this.setState({postString})}
                    value={this.state.postString}
                />
            </View>
            <View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.post}>
                  <Text style={styles.sillyText}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
      );
    } 
}

const styles = StyleSheet.create({  
    container: {
        paddingTop: StatusBar.currentHeight,
        flex: 1,
        //justifyContent: 'center',
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
    width: 365,
    height: 650,
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

export default postScreen;
