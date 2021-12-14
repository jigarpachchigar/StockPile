import React, {useState, useEffect,useImperativeHandle, forwardRef} from 'react';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
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
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import AsyncStorage from '@react-native-community/async-storage';
import InventoryListItem from '../components/InventoryListItem';
import HeaderView from '../components/HeaderView';
import axios from 'axios'
import {log} from 'react-native-reanimated';
import Color from '../constant/colors'

const InventoryListScreen = (props,ref) => {
  const [inventoryList, setInventoryList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateSellPrice, setUpdateSellPrice] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updatequantity, setUpdateQuantity] = useState('')
  const [upperLimit, setUpperLimit] = useState('');
  const [lowerLimit, setLowerLimit] = useState('');
  const [updateProd, setUpdateProd] = useState({});
  const [limit, setLimit] = useState(8);
  const [item, setItem] = useState([]);
  const [offset, setOffset] = useState(0);
  const [end, setEnd] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  useEffect(() => {
    
    getInventoryList(0);
  }, []);
  useImperativeHandle(ref, () => ({
    // methods connected to `ref`
    sayHi: () => { getInventoryList() }
  }))
  const getInventoryList = async () => {
   
    setIsLoading(false);
    const auth_key = await AsyncStorage.getItem('auth_key');
    
    axios.get("https://backend-inventory-management.herokuapp.com/api/v1/auth/products", // console.log('auth key is', auth_key);
      { headers: { "Authorization": `Bearer ${auth_key}` } })
      .then(res => {
        console.log(res.data);
        setProduct(res.data.data)
        setFilterData(res.data.data)
      }).catch(error => console.log('err', error));
  };

  const deleteInventoryItem = async inventoryItem => {
    const auth_key = await AsyncStorage.getItem('auth_key');
    await fetch(
      `https://backend-inventory-management.herokuapp.com/api/v1/products/${
        inventoryItem._id
      }/`,
      {
        method: 'DELETE',
        headers: {Authorization: `Bearer ${auth_key}`},
      },
    )
      .then(() => {
        setOffset(0);
        getInventoryList();
        console.log('deleted successfully!');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const performSearch = async search => {
    
   
      let filteredData = product.filter(function (item) {
        return item.name.includes(search);

      });
      setFilterData(filteredData)
    
    

    
  };
  const updateProductPost = async () => {

    const auth_key = await AsyncStorage.getItem('auth_key');
    axios({
      method: "put",
      url:`https://backend-inventory-management.herokuapp.com/api/v1/products/${item._id}`,
      data:JSON.stringify({
        "name":updateName,
        "quantity": parseInt(updatequantity) ,
        "price": parseInt(updateSellPrice) 
      }),
      headers: {
        Authorization: "Bearer " + auth_key,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => {
        setOffset(0);
        getInventoryList();
        Alert.alert('Success!', 'Product Updated');
      })
      .catch(error => {
        console.log(error);
      });
 
console.warn(item._id)
   
    setUpdateName('');
    setUpdateSellPrice("");
    setUpdateQuantity("")
  };
  const handleReach = () => {
    if (!isSearch) {
      false;
      const newOff = offset + limit;
      if (newOff < end) {
        setIsLoading(true);

        setOffset(newOff);
        console.log(newOff, limit, end);
        getInventoryList(newOff);
      }
    }
  };

  const onMenuPressed = inventoryItem => {
    console.log(inventoryItem,"Item");
    Alert.alert(
      `${inventoryItem.name} (Qty: ${inventoryItem.quantity})`,
      `CAD. ${inventoryItem.price}`,
      [
        {
          text: 'Update',
          onPress: () => {
            setItem(inventoryItem)
            setUpdateQuantity(inventoryItem.quantity)
            setUpdateName(inventoryItem.name)
            setUpdateSellPrice(inventoryItem.price)
           
            setModalVisible(true);
          },
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteInventoryItem(inventoryItem);
          },
        },
        {
          text: 'Cancel',
          // onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
    );
  };
  var radio_props = [
    {label: 'Loose', value: updateProd.loose},
    {label: 'Packed', value: !updateProd.loose},
  ];

  return (
    <Container style={{backgroundColor: '#F3F9FB'}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('No changes made');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.product_titles}>Update Product</Text>
            <View style={{alignItems: 'flex-start', marginVertical: 20}}>
              <Item floatingLabel style={styles.inputBox}>
                <Label style={styles.label}>Product Name</Label>
                <Input
                  style={styles.inputArea}
                  onChangeText={value => {
                    setUpdateName(value);
                  }}
                  value={updateName}
                />
              </Item>
              <Item floatingLabel style={styles.inputBox}>
                <Label style={styles.label}>Selling Price</Label>
                <Input
                  style={styles.inputArea}
                  value={updateSellPrice.toString()}
                  onChangeText={value => {
                    console.log(typeof(value))
                    setUpdateSellPrice(value);
                  }}
                 keyboardType="numeric"
                />
              </Item>
              <Item floatingLabel style={styles.inputBox}>
                <Label style={styles.label}>Quantity</Label>
                <Input
                  style={styles.inputArea}
                  value={updatequantity.toString()}
                  onChangeText={value => {
                    console.log(typeof(value))
                    setUpdateQuantity(value);
                  }}
                 keyboardType="numeric"
                />
              </Item>
            </View>
         
       
        

            <TouchableOpacity
              style={styles.addEmployeeButton}
              // onPress={() => navigation.navigate('AddEmployee')}
              onPress={() => {
                updateProductPost();
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.addEmployeeButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Content>
        {/* the entire outerpart */}
        <Body style={styles.listContainer}>
          {/* the header of table */}
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.inputStyle}
            placeholder=" Search Product"
            placeholderTextColor="gray"
            multiline={false}
            onEndEditing={e => {
              console.log(e.nativeEvent.text);
              if (e.nativeEvent.text === '') {
                setOffset(0);
                console.log('bb');
                getInventoryList(0);
              }
            }}
            onChangeText={search => {
              if (search === '') {
                setIsSearch(false);
                setOffset(0);
                console.log('h');
                setIsLoading(true);
                setInventoryList([]);
                getInventoryList(0);
              } else {
                setIsSearch(true);
                setInventoryList([]);
                setTimeout(() => {
                  performSearch(search);
                }, 1500);
              }
            }}
          />
          <View style={styles.tableHeader}>
            <CardItem
              style={{
                backgroundColor: 'rgba(255,255,255,0)',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                paddingLeft: 40,
              }}>
              <Text style={styles.productNameHeader}>Product</Text>
              <Text style={styles.itemsHeader}>Items</Text>
              <Text style={styles.priceHeader}>Price</Text>
            </CardItem>
          </View>
          <FlatList
            style={styles.flatlist}
            data={filterData}
            extraData={inventoryList}
            renderItem={({item}) => (
              <InventoryListItem
                onMenuPressed={data => onMenuPressed(data)}
                item={item}
              />
            )}
            keyExtractor={item => item.id}
            onEndReached={!isSearch && handleReach}
            onEndReachedThreshold={!isSearch && 0.2}
            ListFooterComponent={() => {
              if (isLoading) {
                return <ActivityIndicator size="large" color="#828282" />;
              }
              return null;
            }}
          />
        </Body>
      </Content>
    </Container>
  );
};

export default forwardRef(InventoryListScreen);

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
    // flexDirection: 'column',
    // backgroundColor: 'blue',
  },
  flatlist: {
    width: DEVICE_WIDTH - 32,
    backgroundColor: '#fff',
    height: 488,
    alignSelf: 'center',
  },
  tableHeader: {
    backgroundColor: '#e7eff2',
    // backgroundColor: 'red',
    // alignSelf: 'stretch',
    width: DEVICE_WIDTH - 32,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignContent: 'stretch',
  },
  inputStyle: {
    marginVertical: 16,
    marginHorizontal: 20,
    height: 55,
    paddingHorizontal: 25,
    alignSelf: 'stretch',
    borderWidth: 2,
    fontSize: 23,
    borderColor: Color.PRIMARY_COLOR,
    borderRadius: 28,
    color: 'black',
  },
  productNameHeader: {
    fontSize: 18,
    paddingLeft: 6,
    fontWeight: 'bold',
    // marginLeft: 50
  },
  itemsHeader: {
    // flex: 0.2,
    fontSize: 18,
    fontWeight: 'bold',
    // marginLeft: 30
  },
  priceHeader: {
    // flex: 0.15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addEmployeeButton: {
    backgroundColor: '#4796BD',
    margin: 40,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    // position:'fixed',
  },
  addEmployeeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlignVertical: 'center',
    // padding:6,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  inputBox: {
    borderRadius: 10,
    textAlign: 'left',
    marginVertical: 10,
    height: 55,
  },
  product_titles: {
    fontSize: 24,
    color: '#122E40',
    marginTop: 25,
    marginBottom: 20,
    alignSelf: 'center',
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
