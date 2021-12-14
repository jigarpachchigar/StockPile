import React, { Component, useState, useEffect } from 'react';
import {
  Body,
  Input,
  Container,
  Content,
  Item,
  Label,
  Icon,
  Header,
} from 'native-base';
import HeaderView from '../components/HeaderView';
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  Alert,
  View,
} from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Color from '../constant/colors'

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setUserPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [storeName, setStoreName] = useState('');
  const [saddress, setSAddress] = useState('');




  const register = () => {
    // navigation.replace('Drawer');
    // fetching the token by providing email and password
    if(name == ""){
      alert("enter name")
    }
    else if(email == ""){
      alert("Enter email")
    }
    else if(password == ""){
      alert("Enter password")
    }
    else if(confirmPass == ""){
      alert("Enter password")
    }
    else if(password != confirmPass){
      alert("please check password and confirm password are same or not")
    }
    else if(storeName == ""){
      alert("Enter store name")
    }
    else if(saddress == ""){
      alert("Enter store address")
    }
    else{
   
    fetch('https://backend-inventory-management.herokuapp.com/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": name,
        "email": email,
        "password": password,
        "shop_name": storeName,
        "shop_address": saddress,
      })
    })
      .then((res) => res.json())
      .then(async (data) => {
        if(data.success == true)
        Alert.alert(
          "Register Successfully",
          "Click ok to login",
          [
           
            { text: "OK", onPress: () =>  navigation.navigate('LoginScreen') }
          ]
        )
        
      console.log(data)
      })
      .catch((err) => alert(err))
         
    }
  }

  return (
    <Container style={{ backgroundColor: '#F3F9FB' }}>
      <Header style={{ backgroundColor: Color.PRIMARY_COLOR, flexDirection: 'row', alignItems: 'center' }} androidStatusBarColor={Color.PRIMARY_COLOR}>
        <Text style={{ color: '#fff', fontSize: 20 }}>Sign Up</Text>
      </Header>
      <Content>
        <Body>
          <Text style={styles.heading}>Sign Up</Text>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontSize: 25,
              color: '#122E40',
              marginLeft: 28,
              marginTop: 25,
              marginBottom: 10,
            }}>
            Account
          </Text>

          <Item floatingLabel style={styles.inputBox}>
            <Label style={styles.label}>Full Name</Label>

            <Input
              style={styles.inputArea}
              blurOnSubmit={true}

              onChangeText={value => {
                setName(value);
              }}
              keyboardType="Full Name"
              autoCapitalize="none"
            />
          </Item>
          <Item floatingLabel style={styles.inputBox}>
            <Label style={styles.label}>Email-id</Label>

            <Input
              style={styles.inputArea}
              blurOnSubmit={true}
              onChangeText={value => {
                setEmail(value);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Item>

          <Item floatingLabel style={styles.inputBox}>
            <Label style={styles.label}>Password</Label>
            <Input
              style={styles.inputArea}
              blurOnSubmit={true}
              onChangeText={value => {
                setUserPassword(value);
              }}
              name="password"
              secureTextEntry
            />
          </Item>
          <Item floatingLabel style={styles.inputBox}>
            <Label style={styles.label}>Confirm Password</Label>

            <Input
              style={styles.inputArea}
              blurOnSubmit={true}
              secureTextEntry
              onChangeText={value => {
                setConfirmPass(value);
              }}

              autoCapitalize="none"
            />
          </Item>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontSize: 25,
              color: '#122E40',

              marginLeft: 28,

              marginTop: 25,
              marginBottom: 10,
              marginBottom: 10,
            }}>
            Store/Shop Details
          </Text>
          <Item floatingLabel style={styles.inputBox}>
            <Label style={styles.label}>Name</Label>

            <Input
              style={styles.inputArea}
              blurOnSubmit={true}
              onChangeText={value => {
                setStoreName(value);
              }}
              variant="rounded"
              keyboardType="Store name"
              autoCapitalize="none"
            />
          </Item>

          <Item floatingLabel style={styles.inputBox}>
            <Label style={styles.label}>Address</Label>

            <Input
              style={styles.inputArea}
              blurOnSubmit={true}
              onChangeText={value => {
                setSAddress(value);
              }}
              keyboardType="Store Name"
              autoCapitalize="none"
            />
          </Item>
          <TouchableOpacity
            rounded
            style={styles.loginButton}
            onPress={() => {
              register()
            }}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </Body>
      </Content>
    </Container>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  newUser: {
    fontSize: 18,
    color: '#9ca2ad',

    marginTop: 25,
    marginBottom: 10,
    marginBottom: 10,
  },
  loginButton: {
    width: 280,
    height: 40,
    backgroundColor: Color.PRIMARY_COLOR,
    borderRadius: 20,
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 20
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
    paddingLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    color: '#828282',
  },
  inputArea: {
    paddingLeft: 20,
  },
});
