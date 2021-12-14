import React, { useEffect,useState } from 'react';
import { StatusBar ,View,StyleSheet} from 'react-native';
import Icon_Feather from 'react-native-vector-icons/Feather';
import Icon_MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AddEmployee from './src/screens/AddEmployee';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import DrawerScreen2 from './src/screens/TransactionsScreen';
import EmployeeListScreen from './src/screens/EmployeeListScreen';
import SplashScreen from './src/screens/SplashScreen';
import AddProduct from './src/screens/AddProduct';
//import ExpiryScreen from './src/screens/ExpiryScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EditEmployee from './src/screens/EditEmployee'
import CustomDrawer from './src/components/CustomDrawer'
import ProfilePage from './src/screens/ProfilePage'
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterScreen from './src/screens/RegisterScreen';
import Color from './src/constant/colors'
const AppStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const EmployeeStack = createNativeStackNavigator();
var role = ""
const App = ({ navigation }) => {


  return (
    <NavigationContainer theme={MyTheme}>
      <AppStack.Navigator headerMode={null} initialRouteName="SplashScreen">
        <AppStack.Screen
          name="LoginScreen"
          component={LoginScreen}
          
          options={{ title: 'Stockpile', headerTitleAlign: 'center',headerShown: false }}
        />
        <AppStack.Screen
          name="SplashScreen"
          component={SplashScreen}
        options={{ title: 'Inventory Management', headerTitleAlign: 'center',headerShown: false }}
        />
        <AppStack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
        options={{ title: 'Inventory Management', headerTitleAlign: 'center' ,headerShown: false}}
        />
        <AppStack.Screen
          name="ProfilePage"
          component={ProfilePage}
        options={{ title: 'Employee', headerTitleAlign: 'center',headerShown: false }}
        />
        <AppStack.Screen
          name="AddProduct"
          component={AddProduct}
          options={{ title: 'Employee', headerTitleAlign: 'center',headerShown: false }}
        />
        <AppStack.Screen
          name="EditEmployee"
          component={EditEmployee}
          options={{ title: 'Employee', headerTitleAlign: 'center',headerShown: false }}
        />
        <AppStack.Screen
          name="Drawer"
          component={MyTabs}
          options={{
            headerShown: false,
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => { }}>
                  <Icon_Feather name="menu" color="white" size={35} />
                </TouchableOpacity>
              );
            },
            headerRight: () => {
              return (
                <TouchableOpacity onPress={() => { }}>
                  <Icon_Feather name="user" color="white" size={35} />
                </TouchableOpacity>
              );
            },
          }}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};
function CustomTabBar(props) {
  const [data, setData] = useState({activeNavTab: 'Home'});
  const [role, setRole] = useState("");
  useEffect(async () => {
      const getResult = async () => {
        let role = await AsyncStorage.getItem('role');
        console.log("rolwww", role)
        setRole(role)
    };

   getResult()
   
  }, []);
  const combineData = (data, params) => {
    const obj = {};
    for (const property in params) {
      obj[property] = params[property];
    }
    return {...data, ...obj};
  };
  const handleNavigation = route => {
    setData(combineData(data, {activeNavTab: route}));
    props?.navigation.navigate(route);
  };
  const getColor = title => {
    let color;
    if (title === data?.activeNavTab) {
      color = Color.PRIMARY_COLOR;
    } else {
      color = "grey";
    }
    return color;
  };
  return (
    <View style={styles.menuWrapper}>
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => handleNavigation('Home')}>
          <Icon_Feather name="home" size={28} color={getColor('Home')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('Inventory')}>
        <Icon_Feather name={'shopping-bag'} size={28} color={getColor('Inventory')} />
        </TouchableOpacity>
      
        {
          role == "admin" ?
          <TouchableOpacity onPress={() => handleNavigation('Employee')}>
          <Icon_Feather name={'users'} size={28} color={getColor('Employee')} />
          </TouchableOpacity>
          :null
        }
       
        <TouchableOpacity onPress={() => handleNavigation('Stocks')}>
        <Icon_Feather name={'trending-up'} size={28} color={getColor('Stocks')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('Profile')}>
        <Icon_Feather name={'user'} size={28} color={getColor('Profile')} />
        </TouchableOpacity>
       
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />} screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home'
        } else if (route.name === 'Inventory') {
          iconName = 'shopping-bag';
        }
        else if (route.name === 'Profile') {
          iconName = 'user';
        }
        else if (route.name === 'Employee') {
          iconName = 'users';
        }
        else if (route.name === 'Stocks') {
          iconName = 'trending-up';
        }

        // You can return any component that you like here!
        return <Icon_Feather name={iconName} size={size} color={color} />;
      },
    })}
      tabBarOptions={{
        activeTintColor: Color.PRIMARY_COLOR,
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
      <Tab.Screen name="Inventory" options={{headerShown: false}} component={InventoryScreen} />
      <Tab.Screen name="Employee" options={{headerShown: false}} component={StackFn} />
      <Tab.Screen name="Stocks" options={{headerShown: false}} component={DrawerScreen2} />
      <Tab.Screen name="Profile" options={{headerShown: false}} component={ProfilePage} />
    </Tab.Navigator>
  );
}
function StackFn() {
  return (
    <EmployeeStack.Navigator initialRouteName="EmployeeList" headerMode="none">
      <EmployeeStack.Screen
        name="EmployeeList"
        component={EmployeeListScreen}
        options={{ title: 'Inventory Management', headerTitleAlign: 'center' ,headerShown: false}}

      />
      <EmployeeStack.Screen  options={{ title: 'Inventory Management', headerTitleAlign: 'center' ,headerShown: false}}  name="AddEmployee" component={AddEmployee} />
    </EmployeeStack.Navigator>
  )
}
function admind() {a

  return (
    <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={
          ({ title: 'Home' },
            { drawerIcon: () => <Icon_MaterialIcons name="home" size={24} color={Color.PRIMARY_COLOR} /> })
        }
      />

      <Drawer.Screen
        name="Inventory"
        component={InventoryScreen}
        options={
          ({ title: 'Inventory' },
            { drawerIcon: () => <FontAwesome5 name="store" size={18} color={Color.PRIMARY_COLOR} /> })
        }
      />
      <Drawer.Screen
        name="Profile"
        component={ProfilePage}
        options={
          ({ title: 'Profile' },
            { drawerIcon: () => <FontAwesome5 name="user" size={24} color={Color.PRIMARY_COLOR} /> })
        }
      />
      {/* <Drawer.Screen
        name="EmployeeAdd"
        component={AddEmployee}
        options={{title: 'Employees add'}}
      />
      <Drawer.Screen
        name="EmployeeList"
        component={EmployeeListScreen}
        options={{title: 'Employees list '}}
      /> */}

      <Drawer.Screen
        name="Employee"
        component={StackFn}
        options={
          ({ title: 'Employee' },
            { drawerIcon: () => <Icon_MaterialIcons name="person" size={24} color={Color.PRIMARY_COLOR} /> })
        }
      />


      <Drawer.Screen
        name="Stocks"

        component={DrawerScreen2}
        options={

          ({ title: 'Transactions' },
            { labelStyle: { fontSize: 55, } },
          {
            drawerIcon: () => (
              <Icon_MaterialIcons name="attach-money" size={24} color="#4796BD" />
            ),
          })
        }
      />
      {/* <Drawer.Screen
        name="Expiry "
        component={ExpiryScreen}
        options={
          ({ title: 'Expiry' },
            { drawerIcon: () => <Icon_MaterialIcons name="settings" size={24} /> })
        }
      /> */}
    </Drawer.Navigator>
  );
}
function employeed() {

  return (
    <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={
          ({ title: 'Home' },
            { drawerIcon: () => <Icon_MaterialIcons name="home" size={24} color={Color.PRIMARY_COLOR} /> })
        }
      />

      <Drawer.Screen
        name="Inventory"
        component={InventoryScreen}
        options={
          ({ title: 'Inventory' },
            { drawerIcon: () => <FontAwesome5 name="store" size={18} color={Color.PRIMARY_COLOR} /> })
        }
      />
      <Drawer.Screen
        name="Profile"
        component={ProfilePage}
        options={
          ({ title: 'Profile' },
            { drawerIcon: () => <FontAwesome5 name="user" size={24} color={Color.PRIMARY_COLOR} /> })
        }
      />


      {/* <Drawer.Screen
        name="Employee"
        component={StackFn}
        options={
          ({ title: 'Employee' },
            { drawerIcon: () => <Icon_MaterialIcons name="person" size={24} color={Color.PRIMARY_COLOR} /> })
        }
      /> */}


      <Drawer.Screen
        name="Stocks"

        component={DrawerScreen2}
        options={

          ({ title: 'Transactions' },
            { labelStyle: { fontSize: 55, } },
          {
            drawerIcon: () => (
              <Icon_MaterialIcons name="attach-money" size={24} color="#4796BD" />
            ),
          })
        }
      />

    </Drawer.Navigator>
  );
}
export default App;
const MyTheme = {
  dark: false,
  colors: {
    primary: '#5c5e61',
    background: '#F3F9FB',
    card: '#fff',
    text: '#000',
    border: 'rgb(199, 199, 204)',
  },
};
const styles = StyleSheet.create({
  menuWrapper: {
    backgroundColor: 'transparent',
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowColor: '#000000',
    elevation: 4,
    marginTop: 1,
    paddingHorizontal: 25,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
  },
  plusBtnContainer: {
    backgroundColor: Color.PRIMARY_COLOR,
    height: 60,
    width: 60,
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// const LoginStack = createNativeStackNavigator();
// const RegisterStack = createNativeStackNavigator();
// function Login() {
//   return (
//     <LoginStack.Navigator headerMode='none'>
//       <LoginStack.Screen name="LoginScreen" component={LoginScreen} />
//       <LoginStack.Screen name="HomeScreen" component={HomeScreen} />
//     </LoginStack.Navigator>
//   );
// }

// function Register() {
//   return (
//     <RegisterStack.Navigator headerMode='none'>
//       <RegisterStack.Screen name="RegisterScreen" component={RegisterScreen} />
//       <RegisterStack.Screen name="HomeScreen" component={HomeScreen} />
//     </RegisterStack.Navigator>
//   );
// }
