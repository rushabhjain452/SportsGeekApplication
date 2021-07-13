import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { Avatar } from "react-native-elements";
import axios from 'axios';

import { baseurl } from '../config';
import getColor from '../helpers/getColor';

import HomeScreen from './HomeScreen';
import LeaderBoardScreen from './LeaderBoardScreen';
import ProfileScreen from './ProfileScreen';
import FantasyScreen from './FantasyScreen';
import ChatScreen from './ChatScreen';
import DetailsScreen from './DetailsScreen';
import MyMatchesScreen from './MyMatchesScreen';
import ScheduleScreen from './ScheduleScreen';
import RootStackScreen from './RootStackScreen';
import AdminScreen from './AdminScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeStack = createStackNavigator();
const AdminStack = createStackNavigator();
const FantasyStack = createStackNavigator();
const ChatStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const LeaderStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const MyMatchesStack = createStackNavigator();

const MainTabScreen = () => {

  const [role, setRole] = useState('');

  const [badge, setBadge] = useState(0);

  useEffect(async () => {
    const role = await AsyncStorage.getItem('role');
    // console.log(role);
    setRole(role);
  }, []);

  const changeBadge = (badge) => {
    setBadge(badge);
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
    >
      { (role == 'Admin') ?
        (<Tab.Screen
          name="Admin Panel"
          component={AdminStackScreen}
          options={{
            tabBarLabel: 'Admin Panel',
            tabBarColor: '#19398A',
            tabBarIcon: ({ color }) => (
              <Icon name="ios-home" color={color} size={26} />
            ),
          }}
        />) :
        (<Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarColor: '#19398A',
            tabBarIcon: ({ color }) => (
              <Icon name="ios-home" color={color} size={26} />
            ),
          }}
        />)
      }
      <Tab.Screen
        name="Fantasy5"
        component={FantasyStackScreen}
        options={{
          tabBarLabel: 'Fantasy',
          tabBarColor: '#19398A',
          tabBarIcon: ({ color }) => (
            <Icon name="game-controller" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatStackScreen}
        options={{
          tabBarLabel: 'Chats',
          tabBarColor: '#19398A',
          tabBarBadge: badge === 0 ? false : badge,
          tabBarIcon: ({ color }) => (
            <Icon name="chatbubbles" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="LeaderBoard"
        component={LeaderStackScreen}
        options={{
          tabBarLabel: 'LeaderBoard',
          tabBarColor: '#19398A',
          tabBarIcon: ({ color }) => (
            <Icon name="trophy" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="My Matches"
        component={MyMatchesStackScreen}
        options={{
          tabBarLabel: 'Matches',
          tabBarColor: '#19398A',
          tabBarIcon: ({ color }) => (
            <Icon name="stats-chart-outline" color={color} size={26} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="My Account"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarColor: '#19398A',
          tabBarIcon: ({ color }) => (
            <Icon name="person-circle" color={color} size={26} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  )
};
export default MainTabScreen;


const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#19398A',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <HomeStack.Screen name="Home" component={HomeScreen} options={{
      title: 'SportsGeek',
      headerLeft: () => (
        <UserAvatar onPress={() => navigation.navigate('ProfileScreen')} />
      )
    }} />
  </HomeStack.Navigator>
);

const AdminStackScreen = ({ navigation }) => (
  <AdminStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#19398A',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <AdminStack.Screen name="Home" component={AdminScreen} options={{
      title: 'SportsGeek',
      headerLeft: () => (
        <UserAvatar onPress={() => navigation.navigate('ProfileScreen')} />
      )
    }} />
  </AdminStack.Navigator>
);

const FantasyStackScreen = ({ navigation }) => (
  <FantasyStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#19398A',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <FantasyStack.Screen name="Fantasy" component={ScheduleScreen} options={{
      title: 'Fantasy',
      headerLeft: () => (
        <UserAvatar onPress={() => navigation.navigate('ProfileScreen')} />
      ),
      headerRight: () => (
        <Icon.Button name="information-circle-outline" size={30} iconStyle={{ marginRight: 0 }} backgroundColor="#19398A" onPress={() => navigation.navigate('HelpScreen')}></Icon.Button>
      )
    }} />
  </FantasyStack.Navigator>
);

const ChatStackScreen = ({ navigation }) => (
  <ChatStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#19398A',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <ChatStack.Screen name="Chat" component={ChatScreen} options={{
      title: 'Chats',
      headerLeft: () => (
        <UserAvatar onPress={() => navigation.navigate('ProfileScreen')} />
      ),
      headerRight: () => (
        <Icon.Button name="search-outline" size={25} backgroundColor="#19398A" iconStyle={{ marginRight: 0 }} onPress={() => navigation.navigate('HelpScreen')}></Icon.Button>
      )
    }} />
  </ChatStack.Navigator>
);

const LeaderStackScreen = ({ navigation }) => (
  <LeaderStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#19398A',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <LeaderStack.Screen name="LeaderBoard" component={LeaderBoardScreen} options={{
      title: 'LeaderBoard',
      headerLeft: () => (
        <UserAvatar onPress={() => navigation.navigate('ProfileScreen')} />
      )
    }} />
  </LeaderStack.Navigator>
);

const MyMatchesStackScreen = ({ navigation }) => (
  <MyMatchesStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#19398A',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <MyMatchesStack.Screen name="My Matches" component={MyMatchesScreen} options={{
      title: 'My Matches',
      headerLeft: () => (
        <UserAvatar onPress={() => navigation.navigate('ProfileScreen')} />
      )
    }} />
  </MyMatchesStack.Navigator>
);

// const ProfileStackScreen = ({ navigation }) => (
//   <ProfileStack.Navigator screenOptions={{
//     headerStyle: {
//       backgroundColor: '#19398A',
//     },
//     headerTintColor: '#fff',
//     headerTitleStyle: {
//       fontWeight: 'bold'
//     }
//   }}>
//     <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{
//       title: 'Profile'
//     }} />
//   </ProfileStack.Navigator>
// );

const UserAvatar = (props) => {
  const [avatarPath, setAvatarPath] = useState('');
  const [shortName, setShortName] = useState('');

  useEffect(async () => {
    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');
    if(userId && token){
      fetchUserData(userId, token);
    }
  }, []);

  const fetchUserData = (userId, token) => {
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/users/' + userId, { headers })
      .then((response) => {
        if (response.status == 200) {
          setAvatarPath(response.data.profilePicture);
          setShortName(response.data.firstName.substr(0, 1) + response.data.lastName.substr(0, 1));
        }
      });
  }

  return (
    avatarPath != '' ?
    (<Avatar
      {...props}
      size="small"
      rounded
      source={{
        uri: avatarPath
      }}
      containerStyle={{ marginLeft: 10 }}
    />) :
      shortName != '' ?
      (<Avatar
      {...props}
        size="small"
        rounded
        title={shortName}
        containerStyle={{ marginLeft: 10, backgroundColor: getColor(props.shortName) }}
      />) :
      <Icon.Button {...props} name="person-circle" size={43} iconStyle={{ marginRight: 0 }} backgroundColor="#19398A"></Icon.Button>
  );
}