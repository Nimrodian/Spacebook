/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  TouchableOpacity, View, Text, StyleSheet, StatusBar, ScrollView, FlatList, Alert, TurboModuleRegistry,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TO-DO list for this screen.
// 1. Implement some kind of scroll view (week 3 lab sheet), to scroll through posts
// 2. Posting to an API

class myDrafts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draft: '',
      isDraft: false,
      id: ''
    };
  }

  async componentDidMount() {
    this.getDrafts();
  }

  getDrafts = async () => {
    let id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    //let draftPosts = await JSON.parse(AsyncStorage.getItem('posts'+id));

    let draftPost = await AsyncStorage.getItem(id);

    console.log(draftPost);

    if(draftPost !== null){
      this.setState({
        draft: draftPost,
        isDraft: true
      })
    }
  };

  post =  async () =>{
    let id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    if(sessionToken != null){
      sessionToken = sessionToken.replaceAll('"', '');
    }
    else {
      return null;
    }

    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post" , {
      method: 'POST',
      headers: {
          'X-Authorization': sessionToken,
          'Content-Type':'application/json'
      },
      body: JSON.stringify({
          text : this.state.draft
      })
  })
  .then((response) => {
      if(response.status == 201){
        console.log("successfully posted!");
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

  deleteDraft = async () =>{
    console.log("deleted");
    let id = await AsyncStorage.getItem('userID');
    await AsyncStorage.removeItem(id);
  }


  render() {
    if(this.state.isDraft == true){
      return (
        <View style={styles.container}>
          <View style={{ height: 700, width: 440, padding: 20 }}>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.sillyText}>
                {this.state.draft}
              </Text>
            </ScrollView>
          </View>
          <View style={{flexDirection: 'row', alignItems: '', justifyContent: 'center'}}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.post}>
                    <Text style={styles.sillyText}>Post draft</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.deleteDraft}>
                    <Text style={styles.sillyText}>Delete draft</Text>
                  </TouchableOpacity>
              </View>
        </View>
      );
    }
    else{
      return(
        <View style={styles.container}>
        <View style={{ height: 760, width: 440, padding: 20 }}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.sillyText}>
              You do not have a draft post saved.
            </Text>
          </ScrollView>
        </View>
        </View>
      );
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
    borderRadius: '20px',
  },
  scrollView: {
    backgroundColor: '#1F3366',
    marginHorizontal: 20,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: '20px',
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
    alignItems: 'center',
    backgroundColor: '#1F3366',
    padding: 10,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: '12px',
    flex: 1,
    margin: 5,
    width: 175,
  },
  item: {
    marginTop: 24,
    padding: 30,
    backgroundColor: '#1F3366',
    fontSize: 24,
    color: 'white',
  },
});

export default myDrafts;
