import React, { Component, useState, useEffect } from 'react';
import { Body, Input, Container, Content, Item, Label, Icon, Header } from 'native-base';
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  Alert,
  View
} from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Color from '../constant/colors'

// For Testing enter password : admin   email : admin@admin.com in text inputs

const LoginScreen = ({ navigation }) => {

  const [email, setUserEmail] = useState('');
  const [password, setUserPassword] = useState('');

  const login = () => {
  
    // fetching the token by providing email and password
    fetch('https://backend-inventory-management.herokuapp.com/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'email': email,
        'password': password
      })
    })
      .then((res) => res.json())
      .then(async (data) => {
        const token = data.token;
        if (token) {
          console.log('token is: ' + token);

          // storing token in async storage
          try {
            await AsyncStorage.setItem('auth_key', token);
            await AsyncStorage.setItem('role', data.role);
            navigation.replace('Drawer');
          } catch (error) {
            console.log('Token not saved in async storage properly');
            console.log(error);
          }

          // using the token just received to check the info of the current logged in user
        
        } else {
          Alert.alert('Invalid email or password', 'Please enter correct credentials')
        }
      })
      .catch((err) => console.log(err))
  }


  return (
    <Container style={{ backgroundColor: '#F3F9FB' }}>
      <Header style={{ backgroundColor: Color.PRIMARY_COLOR, flexDirection: 'row', alignItems: 'center' }} androidStatusBarColor={Color.PRIMARY_COLOR}>
        <Text style={{ color: '#fff', fontSize: 24 }}>Login</Text>
        
      </Header>
      <Content>
        <Body>

          <Image
            style={{
              width: 274,
              height: 207,
              marginVertical: 40,
              marginRight: 10,
            }}
            source={require('../Images/Illustration.jpg')}
          />

          <Item floatingLabel style={styles.inputBox}>

            <Label style={styles.label}>Email ID</Label>

            <Input
              style={styles.inputArea}
              blurOnSubmit={true}
              onChangeText={value => {
                setUserEmail(value);
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
              autoCapitalize="none"
              secureTextEntry
            />
          </Item>

          {/* <TouchableOpacity
            rounded
            style={styles.loginButton}
            onPress={() => {
              Login(email, password);
            }}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            rounded
            style={styles.loginButton}
            onPress={() => {
              login()
            }}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>



          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.newUser}>New ?</Text>
            <TouchableOpacity onPress={() => {
              navigation.navigate('RegisterScreen');
            }}   ><Text style={{
              fontSize: 18,
              textDecorationLine: 'underline',
              color: '#9ca2ad',
              // borderBottomWidth:1,
              // borderBottomColor: 'black',

              marginTop: 25,
              marginBottom: 10,
              marginBottom: 10,
            }}> Sign up here </Text></TouchableOpacity>
          </View>
        </Body>
      </Content>
    </Container>
  );
}

export default LoginScreen;

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
    height: 50,
    backgroundColor: Color.PRIMARY_COLOR,
    borderRadius: 10,
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
    marginBottom: 10,
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
