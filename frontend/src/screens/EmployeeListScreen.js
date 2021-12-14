import React, {Component, useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {
  Button,
  Body,
  Input,
  Container,
  Content,
  Header,
  Right,
  Left,
  Item,
  Label,
  Card,
  CardItem,
} from 'native-base';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import Axios from 'axios';
import EmployeeListItem from '../components/EmployeeListItem';
import HeaderView from '../components/HeaderView';
import AsyncStorage from '@react-native-community/async-storage';

import Color from '../constant/colors'
const EmployeeListScreen = ({navigation}) => {
  const [employeeList, setEmployeeList] = useState([]);
  const [isReady, setReady] = useState(false);
  const [currentUserDetails, setCurrentUserDetails] = useState({});
  const [id, setID] = useState("");
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      getUserList();
      // Call any action
    });
    getUserList();
  }, []);

  // useEffect(() => {
  //   getUserList();
  // }, []);

  // const getCurrentUserInfo = async () => {
  //   const auth_key = await AsyncStorage.getItem('auth_key');

  //   fetch('http://chouhanaryan.pythonanywhere.com/auth/users/me/', {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Token ${auth_key}`,
  //     },
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       // console.log(data)
  //       setCurrentUserDetails(data); //set user details to state
  //       setReady(true);

  //       //if logged in user is a staff, only then he can view the user list
  //       if (data.is_staff) {
  //         getUserList();
  //       }
  //     })
  //     .catch(err => console.log(err));
  // };

  const getUserList = async () => {
    const auth_key = await AsyncStorage.getItem('auth_key');

    fetch('https://backend-inventory-management.herokuapp.com/api/v1/auth/employees', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth_key}`,
      },
    })
      .then(res => res.json())  
      .then(data => {
         console.log(JSON.stringify(data))
         setEmployeeList(data.data);
      })
      .catch(err => console.log(err));
  };
  

  const deleteEmployee = async data => {
    const auth_key = await AsyncStorage.getItem('auth_key');
    await fetch(
      `https://backend-inventory-management.herokuapp.com/api/v1/employees/${
        data._id
      }`,
      {
        method: 'DELETE',
        headers: {Authorization: `Bearer ${auth_key}`},
      },
    )
      .then(() => {
        
        getUserList();
        console.log('deleted successfully!');
      })
      .catch(e => {
        console.log(e);
      });
  };
  const onMenuPressed = employeeItem => {
    Alert.alert(
      `${employeeItem.first_name} ${employeeItem.last_name}`,
      `${employeeItem.email}`,
      [
        {
          text: 'Update',
          onPress: () => {
            navigation.navigate("EditEmployee",{data:employeeItem})
            // setItem(inventoryItem)
            // setUpdateQuantity(inventoryItem.quantity)
            // setUpdateName(inventoryItem.name)
            // setUpdateSellPrice(inventoryItem.price)
           
            // setModalVisible(true);
          },
        },
        {
          text: 'Delete',
          onPress: () => {
           
            deleteEmployee(employeeItem);
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
    );
  };

  // if (isReady) {
  //   if (currentUserDetails.is_staff) {
      return (
        <Container style={{backgroundColor: '#F3F9FB'}}>
          <HeaderView navigation={navigation} title={'Employee Details'} />
          
          <Content>
            {/* the entire outerpart */}
            <Body style={styles.listContainer}>
              {/* the header of table */}
              <View style={styles.tableHeader}>
                <CardItem style={{backgroundColor: 'rgba(255,255,255,0)'}}>
                  <Text style={styles.nameHeader}>Name</Text>
                  <Text style={styles.genderHeader}>Gender</Text>
                  <Text style={styles.emailHeader}>Email</Text>
                  <Text style={styles.ageHeader}>Age</Text>
                </CardItem>
              </View>

              {/* the inner list */}
              <ScrollView>
                <View>
                  <FlatList
                    style={styles.flatlist}
                    data={employeeList}
                    renderItem={({item}) => (
                      <EmployeeListItem
                        onMenuPressed={item => onMenuPressed(item)}
                        item={item}
                      />
                    )}
                    keyExtractor={item => item.id}
                  />
                </View>
              </ScrollView>

              {/* the add employee button */}
              <TouchableOpacity
                style={styles.addEmployeeButton}
                onPress={() => navigation.navigate('AddEmployee', {getUserList})}>
                <Icon name="plus" color="white" size={25} />
                <Text style={styles.addEmployeeButtonText}>Add Employee</Text>
              </TouchableOpacity>
            </Body>
          </Content>
        </Container>
      );
  //   } else if (!currentUserDetails.is_staff) {
  //     return (
  //       <Container style={{backgroundColor: '#F3F9FB'}}>
  //         <HeaderView navigation={navigation} title={'Employee Details'} />
  //         <Content>
  //           <Body
  //             style={{
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //               padding: 30,
  //               marginVertical: 250,
  //             }}>
  //             <Text style={{fontSize: 24, lineHeight: 45, textAlign: 'center'}}>
  //               You do not have permission to View, Create or Delete Employees!
  //             </Text>
  //           </Body>
  //         </Content>
  //       </Container>
  //     );
  //   }
  // } else {
  //   return (
  //     <Container style={{backgroundColor: '#F3F9FB'}}>
  //       <HeaderView navigation={navigation} title={'Employee Details'} />
  //       <Content>
  //         <Body style={{justifyContent: 'center'}}>
  //           <ActivityIndicator size="large" color="#000" />
  //         </Body>
  //       </Content>
  //     </Container>
  //   );
  // }
};

export default EmployeeListScreen;

const DEVICE_WIDTH = Dimensions.get('screen').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#fff',
    borderColor: '#858585',
    borderWidth: 0.5,
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 20,
    width: DEVICE_WIDTH - 32,
  },
  flatlist: {
    width: DEVICE_WIDTH - 32,
    backgroundColor: '#fff',
    height: 500,
  },
  tableHeader: {
    backgroundColor: '#e7eff2',
    // backgroundColor: 'red',
    // alignSelf: 'stretch',
    width: DEVICE_WIDTH - 32,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  nameHeader: {
    flex: 0.3,
    fontSize: 18,
    paddingLeft: 6,
    
    fontWeight: 'bold',
  },
  genderHeader: {
    flex: 0.25,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emailHeader: {
    flex: 0.3,
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 14,
  },
  ageHeader: {
    flex: 0.15,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 30,
  },
  addEmployeeButton: {
    backgroundColor: Color.PRIMARY_COLOR,
    margin: 40,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    // position:'fixed',
  },
  addEmployeeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlignVertical: 'center',
    // padding:6,
  },
});
