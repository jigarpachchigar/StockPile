import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  FlatList,
  Button,
} from 'react-native';
import {
  Container,
  Content,
  Tab,
  Tabs,
  Header,
  Left,
  Right,
  Body,
  Item,
  Input,
  Label,
  Picker,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import Color from '../constant/colors'

const Buy = ({ navigation }) => {
  const [product, setProduct] = useState([]);


  const [selectproduct, setSelectProduct] = useState("");
  const [quantity, setQuantity] = useState('');

  

  useEffect(() => {
    getProduct()

  }, []);


  const getProduct = async () => {
    const auth_key = await AsyncStorage.getItem('auth_key');
    axios.get("https://backend-inventory-management.herokuapp.com/api/v1/auth/products", // console.log('auth key is', auth_key);
      { headers: { "Authorization": `Bearer ${auth_key}` } })
      .then(res => {
        console.log(res.data);
        setProduct(res.data.data)
      }).catch(error => console.log('err', error));

  };

  const stockup = async () => {

    const auth_key = await AsyncStorage.getItem('auth_key');
    axios({
      method: "put",
      url:`https://backend-inventory-management.herokuapp.com/api/v1/products/${selectproduct}`,
      data:JSON.stringify({
        "stock_up":quantity,
      }),
      headers: {
        Authorization: "Bearer " + auth_key,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => {
        console.log(response.data)
        Alert.alert('Success!', 'Product Updated');
      })
      .catch(error => {
        console.log(error);
      });

  };





  return (
    <Container style={{ backgroundColor: '#F3F9FB' }}>
      <ScrollView>
        <Body>
          <Text style={styles.heading}>Stock In</Text>

          {/* separator line above name, phone no. and address fields */}
          <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10 }}>
            <View
              style={{
                borderColor: '#0004',
                borderWidth: 1,
                width: '90%',
                alignSelf: 'center',
                borderRadius: 2,
                marginBottom: -10,
                marginTop: 5,
              }}
            />
          </View>
          <Item style={styles.inputBox}>
            <Label style={{ marginLeft: 28 }}>Product</Label>
            <Picker
              style={{ width: 247, height: 25, marginLeft: 25 }}
              selectedValue={selectproduct}
              onValueChange={value => {
                setSelectProduct(value)
              }}>
              {product.map((item) => {
                return (
                  <Picker.Item label={item.name} value={item._id} />
                )
              })}

            </Picker>
          </Item>
          {/* customer name */}
          <Item floatingLabel style={styles.inputBox}>
            <Label style={styles.label}>Quantity</Label>
            <Input
              style={styles.inputArea}
              value={quantity}
              onChangeText={value => setQuantity(value)}
            />
          </Item>





          <TouchableOpacity
            onPress={async () => {
              const role = await AsyncStorage.getItem('role');
              if(role == "admin")
              {
                stockup()
              }else{
                alert("you don't have permission to stock up")
              }
             
            }}
            style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Stock Up</Text>
          </TouchableOpacity>
        </Body>
      </ScrollView>
    </Container>
  );
};

export default Buy;

const styles = StyleSheet.create({
  dateMainView: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginRight: 20,
    marginLeft: 28,
    textAlign: 'left',
    marginVertical: 10,
    height: 55,
    flex: 9,
  },
  heading: {
    fontSize: 26,
    color: '#122E40',
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
    alignSelf: 'center',
    marginLeft: '5%',
  },
  product_titles: {
    fontSize: 24,
    color: '#122E40',
    marginTop: 25,
    marginBottom: 10,

    marginLeft: '10%',
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
  buyButton: {
    backgroundColor: Color.PRIMARY_COLOR,
    margin: 15,
    padding: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    flexDirection: 'row',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  addButton: {
    borderColor: '#4796BD',
    borderWidth: 2,
    margin: 20,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
  },
  addButtonText: {
    color: '#4796BD',
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  icon: {
    marginLeft: 4,
    marginRight: 10,
  },
});