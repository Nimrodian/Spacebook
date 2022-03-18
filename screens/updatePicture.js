/* eslint-disable no-return-assign */
/* eslint-disable no-return-await */
import React, { Component } from 'react';
import {
  TouchableOpacity, View, Text, StyleSheet, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

class UpdatePictureScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
    };
  }

  //On component mounting will await for permissions to access
  //the camera to be accepted. And set the class state of it to
  //'granted' when accepted bu the user.
  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  }

  /*This method is called from the takePicture method, once a user
  has taken their picture successfully. This method serves to upload
  said picture to the API to tie it to the user in question. The only 
  real difference from all of the other POST requests in this app is 
  that this one takes a body of blob rather than a string or an object.
  If the picture is successfully uploaded the user will be redirected
  back to their homescreen, if not, be alerted of an error and prompted 
  to try again.
  */
  sendToServer = async (data) => {
    // get id and token from async storage.
    const id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');
    const res = await fetch(data.base64);
    const blob = await res.blob();

    if (sessionToken != null) {
      sessionToken = sessionToken.replaceAll('"', '');
    } else {
      return null;
    }
    return await fetch(
      `http://localhost:3333/api/1.0.0/user/${id}/photo`,
      {
        method: 'POST',
        headers: {
          'X-Authorization': sessionToken,
        },
        body: blob,
      },
    )
      .then((response) => {
        if (response.status === 200) {
          alert('Profile picture uploaded successfully');
          this.props.navigation.navigate('Home');
        }
      })
      .catch((e) => {
        console.log(e);
        alert('Something went wrong trying to upload your new profile picture');
      });
  };


  /*This method is called when the user selects the 'take picture' button, 
  and it has a nifty if statement to check if the permissions have been granted
  (see componentDidMount above) for the app to access the devices camera. if 
  so, it will take the picture and then call the method sendToServer, passing
  the image data with it.   
  */
  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      await this.camera.takePictureAsync(options);
    }
  };

  //Render function to show the live feed of the camera for this
  //update picture screen 
  render() {
    if (this.state.hasPermission) {
      return (
        <View style={styles.container}>
          <Camera
            style={styles.camera}
            type={this.state.type}
            ref={(ref) => this.camera = ref}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.takePicture();
                }}
              >
                <Text style={styles.sillyText}> Take Photo</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }

    return (
      <Text>No access to camera</Text>
    );
  }
}

//Style sheet initialised.
const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  scrollView: {
    backgroundColor: '#1F3366',
    marginHorizontal: 20,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: '20px',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  capitaliseNames: {
    textTransform: 'capitalize',
    fontFamily: 'helvetica',
    fontSize: 23,
    color: 'white',
    lineHeight: 45,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: '12px',
    backgroundColor: '#1F3366',
    alignItems: 'center',
    textAlign: 'center',
    width: 310,
    margin: 5,
  },
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
    borderWidth: 2,
    borderRadius: '12px',
    backgroundColor: '#1F3366',
    alignItems: 'center',
    textAlign: 'center',
    width: 310,
    margin: 5,
  },
  textBoxes: {
    alignItems: 'center',
    padding: 10,
    flex: 1,
    margin: 3,
    color: 'white',
    width: 125,
    fontFamily: 'helvetica',
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    padding: 5,
    flex: 1,
    margin: 5,
    backgroundColor: '#1F3366',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: '12px',
  },
});

export default UpdatePictureScreen;
