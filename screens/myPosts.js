import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//TO-DO list for this screen.
//1. Implement some kind of scroll view (week 3 lab sheet), to scroll through posts 
//2. Posting to an API

class myPosts extends Component {
  constructor(props){
    super(props);
    this.state={
      postArray: []
    }
  }

   async componentDidMount(){
    this.getAllPosts();
  }

  getAllPosts = async () => {
    let id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if(sessionToken != null){
      sessionToken = sessionToken.replaceAll('"', '');
    }
    else{
      return null;
    }
    
    return fetch('http://localhost:3333/api/1.0.0/user/'+id+'/post', {
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
        this.setState({
            postArray: responseJson
        })
      })
    }   

    deletePost = async (postID) => {
    let id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if(sessionToken != null){
      sessionToken = sessionToken.replaceAll('"', '');
    }
    else{
      return null;
    }
    
    console.log(id, sessionToken, postID);

    return fetch('http://localhost:3333/api/1.0.0/user/'+id+'/post/'+postID+'/', {
        method: 'DELETE',
        headers: { 
            'X-Authorization': sessionToken,
        }
      })
      .then((response) => {
        if(response.status == 200){
            console.log("post successfully deleted!");        }
      })
      .catch((error) =>{
        console.log(error);
      })      
    }

    editPost(post_id){
        console.log(post_id+"yes");
        this.props.navigation.navigate('Edit your post', {
            post: post_id 
        });
    }

    drafts = () =>{
      this.props.navigation.navigate('My drafts');
    }

    render(){
      return (
        <View style={styles.container}>
          <View style={{height: 765, width: 440, padding: 20}}>
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
                                <TouchableOpacity onPress={() => this.editPost(item.post_id)}>
                                    <Text> 
                                        Edit post
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.deletePost(item.post_id)}>
                                    <Text>
                                        Delete post
                                    </Text>
                                </TouchableOpacity>
                          </View>
                            )}
                        />
          </ScrollView>
          </View>
          <View>
            <TouchableOpacity onPress={this.drafts}>
              <Text>My drafts</Text>
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

export default myPosts;
