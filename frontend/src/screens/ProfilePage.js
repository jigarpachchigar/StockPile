import React, { useState, useEffect, PureComponent } from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, CheckBox } from 'react-native';
import {
    Button,
    Body,
    Input, Container, Radio, Label,
    Header, Left, Right, Col,
} from 'native-base';
import Entypo from 'react-native-vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-community/async-storage';
import Color from '../constant/colors'

import axios from 'react-native-axios';
const ProfilePage = ({ navigation }) => {

    const [editMode, toggleEditMode] = useState(false)

    const [firstName, updateFirstName] = useState('John')
    const [lastName, updateLastName] = useState('Doe')
    const [email, updateEmail] = useState('demo@user.com')
    const [gender, updateGender] = useState('M')
    const [age, updateAge] = useState('20')
    const [role, setRole] = useState('')
    const [shop, updateShop] = useState('abc')
    const [address, updateAddress] = useState('abc')
    const [isStaff, updateIsStaff] = useState(false)

    const [isReady, setReady] = useState(false);


    useEffect(() => {
        getCurrentUserInfo();
    }, []);     //called only when component mounted 

    const getCurrentUserInfo = async () => {

        try {
            const auth_key = await AsyncStorage.getItem('auth_key');

            axios.get("https://backend-inventory-management.herokuapp.com/api/v1/auth/me", // console.log('auth key is', auth_key);
                { headers: { "Authorization": `Bearer ${auth_key}` } })
                .then(res => {
                    console.log(res.data);
                    let role = res.data.data.role
                    setRole(role)
                    let data = res.data.data
                    updateAge(role == "admin" ? "" : data.age.toString())
                    updateEmail(res.data.data.email)
                    updateFirstName(role == "admin" ? data.name : res.data.data.first_name)
                    updateLastName(role == "admin" ? "" : data.last_name)
                    updateGender(role == "admin" ? "" : data.gender)
                    updateShop(role == "admin" ? data.shop_name : "")
                    updateShop(role == "admin" ? data.shop_address : "")
                    // updateIsStaff(isStaff)

                }).catch(error => console.log('err', error))


        }

        catch (err) {
            console.log('error', err)
        }
    }

    const onSavePressed = async () => {

        // validation
        if (firstName === "" || lastName === "" || age === "") {
            if (firstName === "")
                Alert.alert('please enter firstName')
            else if (lastName === "")
                Alert.alert('please enter lastName')
            else if (age === "")
                Alert.alert('please enter age')
        }
        else {
            try {

                // console.log(formData)

                const auth_key = await AsyncStorage.getItem('auth_key');
                axios.put("https://backend-inventory-management.herokuapp.com/api/v1/auth/updatedetails", // console.log('auth key is', auth_key);
                    {
                        "name": firstName,
                        "email": email,

                    }, { headers: { "Authorization": `Bearer ${auth_key}` } })
                    .then(res => {
                        console.log(res.data);
                        if (res.data.success == true) {
                            Alert.alert('details updated')
                            toggleEditMode(!editMode)
                        }
                    }).catch(error => console.log('err', error));

            } catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            <Header style={{ backgroundColor: Color.PRIMARY_COLOR, flexDirection: 'row' }} androidStatusBarColor={Color.PRIMARY_COLOR}>
                <View style={{ alignSelf: 'center', justifyContent: 'center', width: '100%' }}>
                    <Text style={{ fontSize: 21, color: '#fff', alignSelf: 'center', }}>Profile</Text>
                    <TouchableOpacity style={{ position: 'absolute', right: 10 }} onPress={ async() => {
                           await AsyncStorage.removeItem('auth_key');

                           navigation.replace('LoginScreen')
                    }}>
                        <Entypo name="logout" color="white" size={25} />
                    </TouchableOpacity>
                </View>
            </Header>

            {/* container */}


            <View >
                <View style={{ alignItems: 'center', marginTop: 20, }}>
                    {/* <Text style={styles.profileTitle}>  </Text> */}

                    {/* {!editMode && <TouchableOpacity style={styles.editButton} onPress={() => toggleEditMode(!editMode)}>
                            <Icon name="edit" color={Color.PRIMARY_COLOR} size={25} />
                            <Text style={styles.editText}> Edit </Text>
                        </TouchableOpacity>} */}


                </View>

                <View style={{ alignItems: 'center' }}>
                    <View floatingLabel style={styles.inputBox}>
                        <Label style={styles.label}>{role == "admin" ? "Name" :"First Name"}</Label>
                        <Input
                            style={editMode ? styles.inputAreaEditMode : styles.inputAreaViewMode}
                            // placeholder="Username"
                            value={firstName}
                            disabled={editMode ? false : true}
                            onChangeText={val => updateFirstName(val.trim())}
                        />
                    </View>
                    {
                        role != "admin" ?
                    <View floatingLabel style={styles.inputBox}>
                        <Label style={styles.label}>Last Name</Label>
                        <Input
                            style={editMode ? styles.inputAreaEditMode : styles.inputAreaViewMode}
                            // placeholder="Username"
                            value={lastName}
                            disabled={editMode ? false : true}
                            onChangeText={val => updateLastName(val.trim())}
                        />
                    </View>:null}

                    <View style={styles.inputBox}>
                        <Label style={styles.label}>Email</Label>
                        <Input
                            style={styles.inputAreaViewMode}
                            // placeholder="Username"
                            value={email}
                            disabled={true}
                        />
                    </View>



                    {
                        role == "admin" ?
                            <View style={styles.inputBox}>

                                <Label style={styles.label}>Store Name</Label>
                                <Input
                                    keyboardType="numeric"
                                    style={editMode ? styles.inputAreaEditMode : styles.inputAreaViewMode}
                                    onChangeText={val => updateAge(val.trim())}
                                    value={shop}
                                    disabled={editMode ? false : true}
                                />
                            </View>
                            :
                            <View style={styles.inputBox}>

                                <Label style={styles.label}>Age</Label>
                                <Input
                                    keyboardType="numeric"
                                    style={editMode ? styles.inputAreaEditMode : styles.inputAreaViewMode}
                                    onChangeText={val => updateAge(val.trim())}
                                    value={age}
                                    disabled={editMode ? false : true}
                                />
                            </View>
                    }

                    {
                        role == "admin" ?
                            <View style={styles.inputBox}>
                                <Label style={styles.label}>Store Address</Label>

                                <Input
                                    style={styles.inputAreaViewMode}
                                    // placeholder="Username"
                                    value={address}
                                    disabled={true}
                                />
                            </View>
                            :
                            <View style={styles.inputBox}>
                                <Label style={styles.label}>Gender</Label>

                                <Input
                                    style={styles.inputAreaViewMode}
                                    // placeholder="Username"
                                    value={gender}
                                    disabled={true}
                                />
                            </View>}
                            <View style={styles.inputBox}>
                                <Label style={styles.label}>Role</Label>

                                <Input
                                    style={styles.inputAreaViewMode}
                                    // placeholder="Username"
                                    value={role}
                                    disabled={true}
                                />
                            </View>
                    {/* <View style={styles.inputBox}>

                            <Label style={styles.label}>is staff?</Label>
                            <Text style={styles.inputAreaViewMode}> {isStaff ? "true" : "false"}</Text>
                        </View> */}



                    {/* {
                            editMode &&
                            <View style={styles.inputBox}>

                                <Label style={styles.label}> is staff? </Label>
                                <View style={styles.radioGroup}>
                                    <Text style={styles.isStaffText}> true </Text>
                                    <Radio selected={isStaff} />

                                    <Text style={styles.isStaffText}> false </Text>
                                    <Radio selected={!isStaff} />
                                </View>
                            </View>
                        } */}

                    {/* end of userinput */}

                </View>
                {/* end of form */}
                {
                    editMode &&
                    <TouchableOpacity style={styles.saveButton} onPress={() => onSavePressed()}>
                        {/* <Icon name="edit" color="#4796BD" size={25} /> */}
                        <Text style={styles.editText}> Save </Text>
                    </TouchableOpacity>
                }


                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={async () => {

                        await AsyncStorage.removeItem('auth_key');

                        navigation.replace('LoginScreen')
                    }}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({

    profileTitle: {
        fontSize: 22,
        flex: 1,
        textAlign: 'center'
    },
    editText: {
        color: Color.PRIMARY_COLOR,
    },
    editButton: {
        // flex: 0.6,
        borderColor: Color.PRIMARY_COLOR,
        borderWidth: 2,
        width: 200,
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    label: {
        paddingLeft: 5,
        color: '#828282',
        fontSize: 16,
        textAlignVertical: 'center',

    },
    saveButton: {
        // flex: 0.4,
        borderColor: Color.PRIMARY_COLOR,
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 20,
        marginHorizontal: 60,

        // flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    inputAreaEditMode: {
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        marginRight: 28,
        marginLeft: 28,
        textAlign: 'center',

        fontSize: 20,
        height: 55,
        // width: '60%'
    },
    inputAreaViewMode: {
        backgroundColor: 'transparent',
        // backgroundColor:'green',
        borderRadius: 10,
        marginRight: 28,
        marginLeft: 28,
        textAlign: 'center',
        // marginVertical: 10,
        fontSize: 20,
        height: 55,
        // flexDirection: 'row',
        flex: 1,
    },
    radioGroup: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center'
    },
    inputBox: {
        flexDirection: 'row',
        borderRadius: 10,
        marginRight: 28,
        marginLeft: 28,
        textAlign: 'left',
        marginVertical: 10,
    },
    isStaffText: {
        fontSize: 20,
        marginLeft: 30,
    },

    logoutButton: {
        backgroundColor: Color.PRIMARY_COLOR,
        marginHorizontal: 100,
        paddingVertical: 10,
        // paddingHorizontal: ,
        borderRadius: 10,
        // flexDirection: 'row',
        // position:'fixed',
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        textAlignVertical: 'center',
        textAlign: 'center',
    },

})

export default ProfilePage;

