import React, { Component } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

class EditEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            address: "",
            nip: "",
            photo: "",
            loading: false,
            errorMessage: ''
        };
    }

    componentDidMount() {
        // state value is updated by selected employee data
        const { name, address, nip, photo } = this.props.selectedEmployee;
        this.setState({
            name: name,
            address: address,
            nip: nip,
            photo: photo,
        })
    }

    handleChange = (value, state) => {
        this.setState({ [state]: value })
    }

    updateEmployee = () => {
        // destructure state
        const { name, address, nip, photo } = this.state;
        this.setState({ errorMessage: "", loading: true });

        if (name && address && nip && photo) {
            // selected employee is updated with employee id
            fetch(`http://localhost:8000/api/employees/${this.props.selectedEmployee.id}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: this.state.name,
                    address: this.state.address,
                    nip: this.state.nip,
                    photo: this.state.photo,
                })
            })
                .then(res => res.json())
                .then(res => {
                    this.props.closeModal();
                    this.props.updateEmployee({
                        name: res.name,
                        address: res.address,
                        nip: res.nip,
                        photo: res.photo,
                        id: this.props.selectedEmployee.id
                    });
                })
                .catch(() => {
                    this.setState({ errorMessage: "Network Error. Please try again.", loading: false })
                })
        } else {
            this.setState({ errorMessage: "Fields are empty.", loading: false })
        }
    }

    render() {
        const { isOpen, closeModal } = this.props;
        const { name, address, nip, photo, loading, errorMessage } = this.state;
        return (
            <Modal
                visible={isOpen}
                onRequestClose={closeModal}
                animationType="slide"
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Update Employee</Text>

                    <TextInput
                        value={name}
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "name")}
                        placeholder="Full Name" />

                    <TextInput
                        value={address}
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "address")}
                        placeholder="Address" />

                    <TextInput
                        value={photo}
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "photo")}
                        placeholder="Photo" />

                    <TextInput
                        value={nip}
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "nip")}
                        placeholder="NIP" />

                    {loading ? <Text
                        style={styles.message}>Please Wait...</Text> : errorMessage ? <Text
                            style={styles.message}>{errorMessage}</Text> : null}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={this.updateEmployee}
                            style={{ ...styles.button, marginVertical: 0 }}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={closeModal}
                            style={{ ...styles.button, marginVertical: 0, marginLeft: 10, backgroundColor: "tomato" }}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        );
    }
}



export default EditEmployee;

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 20
    },
    textBox: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "rgba(0,0,0,0.3)",
        marginBottom: 15,
        fontSize: 18,
        padding: 10
    },
    buttonContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    button: {
        borderRadius: 5,
        marginVertical: 20,
        alignSelf: 'flex-start',
        backgroundColor: "gray",
    },
    buttonText: {
        color: "white",
        paddingVertical: 6,
        paddingHorizontal: 10,
        fontSize: 16
    },
    message: {
        color: "tomato",
        fontSize: 17
    }
})