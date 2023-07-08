import React, { Component } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

class CreateEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      address: '',
      nip: '',
      photo: null,
      loading: false,
      errorMessage: '',
    };
  }

  handleChange = (value, state) => {
    this.setState({ [state]: value });
  };

  handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      this.setState({ photo: result.assets[0].uri });
    }
  };

  handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access the camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.canceled) {
      this.setState({ photo: result.assets[0].uri });
    }
  };

  addEmployee = () => {
    const { name, nip, address, photo } = this.state;
    this.setState({ errorMessage: '', loading: true });

    if (name && nip && address) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('address', address);
      formData.append('nip', nip);
      formData.append('photo', {
        uri: photo,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      fetch('http://192.168.1.127:8000/api/employees/create', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          this.props.closeModal();
          this.props.addEmployee({
            name: res.name,
            address: res.address,
            nip: res.nip,
            photo: res.photo,
            id: res.id,
          });
        })
        .catch(() => {
          this.setState({ errorMessage: 'Network Error. Please try again.', loading: false });
        });
    } else {
      this.setState({ errorMessage: 'Fields are empty.', loading: false });
    }
  };

  render() {
    const { isOpen, closeModal } = this.props;
    const { loading, errorMessage, photo } = this.state;
    return (
      <Modal visible={isOpen} onRequestClose={closeModal} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.title}>Add New Employee</Text>

          <TextInput
            style={styles.textBox}
            onChangeText={(text) => this.handleChange(text, 'name')}
            placeholder="Full Name"
          />

          <TextInput
            style={styles.textBox}
            onChangeText={(text) => this.handleChange(text, 'address')}
            placeholder="Address"
          />

          <TextInput
            keyboardType="numeric"
            style={styles.textBox}
            onChangeText={(text) => this.handleChange(text, 'nip')}
            placeholder="Nip"
          />

            <TouchableOpacity style={styles.photoButton} onPress={this.handleChoosePhoto}>
            <Text style={styles.photoButtonText}>Choose Photo</Text>
            </TouchableOpacity>

            <Text style={styles.title}>OR</Text>

            <TouchableOpacity style={styles.photoButton} onPress={this.handleTakePhoto}>
                <Text style={styles.photoButtonText}>Take Photo</Text>
            </TouchableOpacity>

          {photo && <Image source={{ uri: photo }} style={styles.photoPreview} />}

          {loading ? (
            <Text style={styles.message}>Please Wait...</Text>
          ) : errorMessage ? (
            <Text style={styles.message}>{errorMessage}</Text>
          ) : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.addEmployee} style={{ ...styles.button, marginVertical: 0 }}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeModal}
              style={{
                ...styles.button,
                marginVertical: 0,
                marginLeft: 10,
                backgroundColor: 'tomato',
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default CreateEmployee;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  textBox: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'rgba(0,0,0,0.3)',
    marginBottom: 15,
    fontSize: 18,
    padding: 10,
  },
  photoButton: {
    backgroundColor: 'gray',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  photoButtonText: {
    color: 'white',
    fontSize: 16,
  },
  photoPreview: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    borderRadius: 5,
    marginVertical: 20,
    alignSelf: 'flex-start',
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  message: {
    color: 'tomato',
    fontSize: 17,
  },
});
