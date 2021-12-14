import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
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
  Picker,
  Label,
  Form,
} from 'native-base';
import Color from '../constant/colors'
import Icon from 'react-native-vector-icons/Feather';
//http://chouhanaryan.pythonanywhere.com/api/sell/

const Sell = ({navigation}) => {
  const [product, setProduct] = useState([]);


  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectproduct, setSelectProduct] = useState('');


 

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
  
  const stockleft = async () => {

    const auth_key = await AsyncStorage.getItem('auth_key');
    axios({
      method: "put",
      url:`https://backend-inventory-management.herokuapp.com/api/v1/products/${selectproduct}`,
      data:JSON.stringify({
        "quantity":quantity,
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
    <Container style={{backgroundColor: '#F3F9FB'}}>
      <Content>
        <Body>
          <Text style={styles.heading}>Stock Left</Text>
          
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

          {/* customer name */}
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
              if(role != "admin")
              {
                stockleft()
              }else{
                alert("only employee can stock left")
              }
          
            }}
            style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Save</Text>
          </TouchableOpacity>
        </Body>
      </Content>
    </Container>
  );
};

export default Sell;

const styles = StyleSheet.create({
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
    alignSelf: 'flex-start',
    marginLeft: '5%',
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
  sellButton: {
    backgroundColor: '#4796BD',
    margin: 15,
    padding: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    flexDirection: 'row',
  },
  sellButtonText: {
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
});
