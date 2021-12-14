import React, { Component } from 'react';
import RadioForm, {
    RadioButton,
    RadioButtonInput,
    RadioButtonLabel,
} from 'react-native-simple-radio-button';
import HeaderView from '../components/HeaderView';
import axios from 'react-native-axios'
import {
    Button,
    Body,
    Input,
    Container,
    Content,
    Header,
    Item,
    Label,
} from 'native-base';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    KeyboardAvoidingView,
    Dimensions,
    Picker,
    Alert,
} from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Color from '../constant/colors'
import { ActivityIndicator } from 'react-native';
export default class AddProduct extends Component {
    constructor(props) {
        super(props);
        console.log(props.route.params);
        this.state = {
            pname: '',
            quantity: '',
            price: '',
            loader: false

        };
    }
    async keyy() {
        console.log(await AsyncStorage.getItem('auth_key'));
        return await AsyncStorage.getItem('auth_key');
    }

    addproduct = async () => {
        const auth_key = await AsyncStorage.getItem('auth_key');
        
        axios.post("https://backend-inventory-management.herokuapp.com/api/v1/products", // console.log('auth key is', auth_key);
            {
                "name": this.state.pname,
                "quantity":this.state.quantity,
                "price": this.state.price
            }, { headers: { "Authorization": `Bearer ${auth_key}` } })
            .then(res => {
                console.log(res.data);
                if (res.data.success == true) {
                    Alert.alert('Success!', 'Product Added Successfully!');
                    this.props.navigation.goBack();
                }
            }).catch(error => console.log('err', error));

    };



    render() {
        if(this.state.loader){
        return (
            <Container style={{ backgroundColor: '#F3F9FB' }}>
                <HeaderView navigation={this.props.navigation} title={'Add Product'} />
                <Content>
                    <ActivityIndicator></ActivityIndicator>
                </Content>
            </Container>
        )}else{
        return (
            <Container style={{ backgroundColor: '#F3F9FB' }}>
                <HeaderView navigation={this.props.navigation} title={'Add Product'} />
                <Content>
                    <ScrollView>
                        <Body>
                            <Text style={styles.heading}>Product</Text>

                            <Item floatingLabel style={styles.inputBox}>
                                <Label style={styles.label}>Product Name</Label>
                                <Input
                                    style={styles.inputArea}
                                    onChangeText={value => {
                                        this.setState({ pname: value });
                                    }}
                                />
                            </Item>
                            <Item floatingLabel style={styles.inputBox}>
                                <Label style={styles.label}>Quantity</Label>
                                <Input
                                    style={styles.inputArea}
                                    onChangeText={value => {
                                        this.setState({ quantity: value });
                                    }}
                                />
                            </Item>

                            <Item floatingLabel style={styles.inputBox}>
                                <Label style={styles.label}>Price</Label>
                                <Input
                                    style={styles.inputArea}
                                    onChangeText={value => {
                                        this.setState({ price: value });
                                    }}
                                />
                            </Item>


                            <TouchableOpacity
                                rounded
                                style={styles.regButton}
                                onPress={() => {
                                    if (
                                        this.state.pname !== '' &&
                                        this.state.price !== '' &&
                                        this.state.quantity !== ''

                                    ) {


                                        this.addproduct();

                                    } else {
                                        Alert.alert('Alert', 'Please enter all the fields');
                                    }
                                }}>
                                <Text style={styles.buttonText}>Add</Text>
                            </TouchableOpacity>
                        </Body>
                    </ScrollView>
                </Content>
            </Container>
        );
                            }
    }
}

const styles = StyleSheet.create({
    regButton: {
        width: 280,
        height: 40,
        backgroundColor: Color.PRIMARY_COLOR,
        borderRadius: 20,
        justifyContent: 'center',
        marginTop: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        alignSelf: 'center',
        alignContent: 'flex-start',
        textAlign: 'center',
    },
    heading: {
        fontSize: 30,
        color: '#122E40',
        fontWeight: 'bold',
        marginTop: 25,
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginLeft: 27,
    },
    subHeading: {
        fontSize: 22,
        color: '#122E40',
        alignSelf: 'flex-start',
        marginTop: 10,
        marginLeft: 20,
    },
    inputBox: {
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        marginRight: 28,
        marginLeft: 28,
        textAlign: 'left',
        marginVertical: 10,
        height: 55,
    },

    label: {
        paddingLeft: 30,
        color: '#828282',
        fontSize: 15,
    },
    inputArea: {
        paddingLeft: 20,
    },
});
