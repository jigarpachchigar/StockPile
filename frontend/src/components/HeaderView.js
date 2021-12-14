import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Header, Left, Right, Body } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/SimpleLineIcons';
import Color from '../constant/colors'
import  AsyncStorage  from '@react-native-community/async-storage';

const HeaderView = ({ navigation, title }) => {
  return (
    <Header style={{ backgroundColor: Color.PRIMARY_COLOR, flexDirection: 'row' }} androidStatusBarColor={Color.PRIMARY_COLOR} >

      <View style={{ alignSelf: 'center', justifyContent: 'center', width: '100%' }}>
        <Text style={{ fontSize: 21, color: '#fff', alignSelf: 'center', }}>{title}</Text>
        <TouchableOpacity style={{ position: 'absolute', right: 10 }}
          onPress={async () => {
            await AsyncStorage.removeItem('auth_key');
            navigation.replace('LoginScreen')
          }}>
          <Entypo name="logout" color="white" size={25} />
        </TouchableOpacity>
      </View>


    </Header>
  );
}

export default HeaderView;
