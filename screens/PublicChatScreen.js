import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import showSweetAlert from '../helpers/showSweetAlert';
import { baseurl, errorMessage, chatRefreshDelay, chatDays } from '../config';
import { convertUTCDateToLocalDate } from '../helpers/dateConversion';

const PublicChatScreen = () => {

  const [messages, setMessages] = useState([]);
  const [lastId, setLastId] = useState(0);

  const [userId, setUserId] = useState(0);

  const [token, setToken] = useState('');

  const [loading, setLoading] = useState(true);

  const intervalRef = useRef();

  useEffect(async () => {
    const token = await AsyncStorage.getItem('token');
    setToken(token);
    // Get UserId
    let userId = await AsyncStorage.getItem('userId');
    setUserId(parseInt(userId));
    fetchMessages(token);
    // Refresh messages at some interval
    intervalRef.current = setInterval(() => {
      if (token) {
        // refreshMessages(token);
        // console.log('After 10 seconds');
      }
    }, chatRefreshDelay);
    // Unmount
    return () => {
      console.log('Interval cleared...');
      clearInterval(intervalRef.current);
    };
  }, []);

  const fetchMessages = (token) => {
    const headers = { 'Authorization': 'Bearer ' + token };
    console.log(baseurl + '/public-chat/formatted/last-days/' + chatDays);
    axios.get(baseurl + '/public-chat/formatted/last-days/' + chatDays, { headers })
      .then((response) => {
        setLoading(false);
        if (response.status == 200) {
          const data = response.data;
          if (data.length > 0) {
            // console.log(data);
            // console.log('Size : ' + data.length);
            // console.log(data[0]._id);
            setLastId(data[0]._id);
          }
          data.forEach((item) => item.createdAt = convertUTCDateToLocalDate(new Date(item.createdAt)));
          data.push({
            _id: 0,
            text: 'Welcome to SportsGeek Public Chat',
            system: true
          });
          setMessages(data);
        } else {
          showSweetAlert('warning', 'Unable to fetch data!', 'Unable to fetch old Chats.');
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);
        showSweetAlert('error', 'Network Error', errorMessage);
      });
  };

  const refreshMessages = (token) => {
    console.log('Old data length : ' + messages.length);
    if(messages.length > 0){
      const headers = { 'Authorization': 'Bearer ' + token };
      console.log(baseurl + '/public-chat/formatted/after-id/' + lastId);
      axios.get(baseurl + '/public-chat/formatted/after-id/' + lastId, { headers })
        .then((response) => {
          setLoading(false);
          if (response.status == 200) {
            const newData = response.data;
            console.log('newData length : ' + newData.length);
            if (newData.length > 0) {
              setLastId(newData[0]._id);
              newData.forEach((item) => item.createdAt = convertUTCDateToLocalDate(new Date(item.createdAt)));
              console.log('oldData : ');
              console.log(messages);
              console.log('newData : ');
              console.log(newData);
              // setMessages(data => [...data, ...newData]);
              setMessages(data => newData.concat(data));
              // console.log(data);
            }
          } else {
            showSweetAlert('warning', 'Unable to fetch data!', 'Unable to fetch old Chats.');
          }
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Network Error', errorMessage);
        });
    }else{
      console.log('Messages : ');
      console.log(messages)
    }
  };

  // helper method that sends a message
  function handleSend(newMessage = []) {
    // console.log('newMessage : ');
    // console.log(newMessage);
    // API call to insert chat in DB
    const headers = { 'Authorization': 'Bearer ' + token }
    const requestData = {
      userId: userId,
      message: newMessage.text
    };
    axios
      .post(baseurl + '/public-chat', requestData, { headers })
      .then((response) => {
        setLoading(false);
        if (response.status == 201) {
          // showSweetAlert('success', 'Success', 'Message sent successfully.');
        }
        else {
          showSweetAlert('error', 'Error', 'Error in sending your message. Please try again...');
        }
      })
      .catch((error) => {
        showSweetAlert('error', 'Error', 'Error in sending your message. Please try again...');
      })
    // To display chat is UI
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
  }

  if (userId != 0) {
    return (
      <>
        {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
        <GiftedChat
          messages={messages}
          onSend={newMessage => handleSend(newMessage[0])}
          user={{ _id: userId }}
          renderUsernameOnMessage={true}
          showAvatarForEveryMessage={true}
          maxInputLength={1000}
          renderAvatarOnTop={true}
        // scrollToBottom={true}
        />
      </>
    );
  } else {
    // return (<Text>Loading...</Text>);
    return null;
  }
}

export default PublicChatScreen;