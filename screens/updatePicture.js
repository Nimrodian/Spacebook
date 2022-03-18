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

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  }

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
