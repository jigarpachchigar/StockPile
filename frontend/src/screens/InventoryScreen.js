import React, {Component,useState,useEffect,useRef} from 'react';
import {Dimensions,TouchableOpacity,StyleSheet,Text} from 'react-native';
import {Container, Tab, Tabs} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import InventoryListScreen from './InventoryListScreen';
import ExpiryScreen from './ExpiryScreen'
import HeaderView from '../components/HeaderView';
import Color from '../constant/colors'

const TransactionsScreen = ({navigation}) => {
  const [product, setProduct] = useState([]);
  const childRef = useRef()
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      childRef.current.sayHi()
      // Call any action
    });
   
  }, []);

  return (
    <Container>
      <HeaderView navigation={navigation} title={'Inventory'} />

 
      

      <InventoryListScreen ref={childRef} product={product} />

      <TouchableOpacity
            onPress={() => {
              navigation.navigate("AddProduct")
            }}
            style={styles.addButton}>
            <Icon name="plus" color={Color.PRIMARY_COLOR} size={25} style={styles.icon} />
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
    </Container>
  );
};

export default TransactionsScreen;
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
    backgroundColor: '#4796BD',
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
    borderColor: Color.PRIMARY_COLOR,
    borderWidth: 2,
    margin: 20,
    padding: 10,
    width:'40%',
    borderRadius: 5,
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
    alignSelf:'center'
  },
  addButtonText: {
    color: Color.PRIMARY_COLOR,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  icon: {
    marginLeft: 4,
    marginRight: 10,
  },
});