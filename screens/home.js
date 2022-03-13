import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//TO-DO list for this screen.
//1. Implement some kind of scroll view (week 3 lab sheet), to scroll through posts 
//2. Posting to an API

class homeScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      postArray: []
    }
  }

   async componentDidMount(){
    this.getFriends();
  }

  getAllPosts = async (response) => {
    let sessionToken = await AsyncStorage.getItem('token');

    if(sessionToken != null){
      sessionToken = sessionToken.replaceAll('"', '');
    }
    else{
      return null;
    }

    let allPosts = []

    for (let i = 0; i < response.length; i++){
      console.log(response[i].user_id);
      let testValue = await fetch('http://localhost:3333/api/1.0.0/user/'+response[i].user_id+'/post', {
        method: 'GET',
        headers: { 'X-Authorization': sessionToken
        }
      })
      .then((response) => {
        if(response.status == 200){
          return response.json()
        }
      })
      .then((responseJson) => {
        console.log(responseJson);
        for(let i = 0; i < responseJson.length; i++){
          allPosts.push(responseJson[i]);
        }
      })
  }
  allPosts = allPosts.sort((x, y) => new Date(x.timestamp) - new Date(y.timestamp));
  this.setState({
    postArray: allPosts
  })

  console.log(this.state.postArray);
}

  logout = async () => {
    let sessionToken = await AsyncStorage.getItem('token');

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


  //Function to get a list of the current user's friends
  //to loop through the friend list and display their posts.
  getFriends = async () => {
    let id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if(sessionToken != null){
      sessionToken = sessionToken.replaceAll('"', '');
    }
    else{
      return null;
    }

    return fetch('http://localhost:3333/api/1.0.0/user/'+id+'/friends', {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken
      }
    })
    .then((response) => {
      if(response.status == 200){
        return response.json();
      }
      else if(response.status == 401){
        throw 'something went wrong';
      }
    })
    .then((responseJson) => {
      this.getAllPosts(responseJson);
    })
    // .then(async (responseJson) => {
    //   let postArray = [];
    //   for(let i=0; i < responseJson.length; i++){
    //     console.log(responseJson[i].user_id);
    //     return fetch('http://localhost:3333/api/1.0.0/user/'+responseJson[i].user_id+'/post', {
    //       method: 'GET',
    //       headers: {
    //         'X-Authorization': sessionToken
    //       }
    //     })
    //     .then((response) => {
    //       if(response.status == 200){
    //         postArray.push(response)
    //       }
    //     })
    //   }
    // })
  }

  myProfile = () => {
    this.props.navigation.navigate('Profile');
  }

  search = () => {
    this.props.navigation.navigate('Search');
  }

  post = async () =>{
    console.log("Post");
    this.props.navigation.navigate('Write a post');
  }

  likePost = async (user_id, post_id) => {
    console.log("liked post");
    console.log(user_id, post_id);

    let id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if(sessionToken != null){
      sessionToken = sessionToken.replaceAll('"', '');
    }
    else{
      return null;
    }
    return fetch('http://localhost:3333/api/1.0.0/user/'+user_id+'/post/'+post_id+'/like', {
      method: 'POST',
      headers: {
        'X-Authorization': sessionToken
      }
    })
    .catch((error) =>{
      console.log(error);
    })

  }

  dislikePost = async (user_id, post_id) => {
    console.log("removed like from post");
    console.log(user_id, post_id);

    let id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if(sessionToken != null){
      sessionToken = sessionToken.replaceAll('"', '');
    }
    else{
      return null;
    }
    return fetch('http://localhost:3333/api/1.0.0/user/'+user_id+'/post/'+post_id+'/like', {
      method: 'DELETE',
      headers: {
        'X-Authorization': sessionToken
      }
    })
    .catch((error) =>{
      console.log(error);
    })
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
          <View style={{flexDirection: 'row', alignItems: '', justifyContent: 'center'}}>
            <TouchableOpacity style={styles.button}
                onPress={this.search}>
                  <Text style={styles.sillyText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={this.post}>
                  <Text style={styles.sillyText}>Write a post</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 680, width: 440, padding: 20}}>
          <ScrollView style={styles.scrollView}>
                    <FlatList
                        keyExtractor={(item) => item.post_id}
                        data = {this.state.postArray}
                        renderItem={({ item }) => (
                          <View style={{alignItems: 'row'}}>
                                <Text 
                                style={styles.item}>
                                {item.post_id} {" "} {item.author.first_name} {" "} {item.text} {" "} {item.timestamp}
                                {"   "} {item.numLikes}
                                </Text>
                                <View style={{alignItems: 'row'}}>
                                  <TouchableOpacity onPress={() => this.likePost(item.author.user_id,item.post_id)}>
                                    <Text style={styles.sillyText}>Like</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={() => this.dislikePost(item.author.user_id,item.post_id)}>
                                    <Text style={styles.sillyText}>Remove like</Text>
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
  item: {
    marginTop: 24,
    padding: 30,
    backgroundColor: '#1F3366',
    fontSize: 24,
    color: 'white'
}
  })

export default homeScreen;
