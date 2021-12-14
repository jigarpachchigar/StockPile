import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer'
import React, { Component } from 'react';
import { Dimensions, StyleSheet, Image,Text } from 'react-native'
import Color from '../constant/colors'

const drawerCover = require("../Images/store-inventory-logo.png")
const deviceHeight = Dimensions.get("window").height
const deviceWidth = Dimensions.get("window").width

const CustomDrawer = (props) => {
    // console.log('hereee')
    return (
        <DrawerContentScrollView {...props}>

            <Image resizeMode={"stretch"}  source={drawerCover} style={styles.drawerCover} />
            <Text style={{alignSelf:'center',fontWeight:"bold",color:Color.PRIMARY_COLOR,fontSize:20,marginBottom:20}}>Stock pile</Text>

            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}
export default CustomDrawer

const styles = StyleSheet.create({
    drawerCover: {
        alignSelf: "stretch",
        height: deviceHeight / 4.5,
        width: null,
        position: "relative",
        margin: 30,
        marginBottom:5
    },
})