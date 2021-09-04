import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator, StatusBar } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';

import showSweetAlert from '../helpers/showSweetAlert';
import { baseurl, errorMessage, chatRefreshDelay, chatDays } from '../config';
import { convertUTCDateToLocalDate } from '../helpers/dateConversion';

import { AuthContext } from '../App';

const PublicChatScreen = () => {
  const { loginState } = React.useContext(AuthContext);
  const token = loginState.token;
  const userId = parseInt(loginState.userId);

  const [messages, setMessages] = useState([]);
  // const [lastId, setLastId] = useState(0);
  let lastId = 0;
  let lastResponseArrived = true;
  let lastLogId = 0;

  const [loading, setLoading] = useState(true);

  const intervalRef = useRef();

  useEffect(() => {
    console.log('PublicChat useEffect() called...');
    fetchMessages();
    // Refresh messages at some interval
    // Don't refresh automatically, refresh on button click
    // intervalRef.current = setInterval(() => {
    //   if (token) {
    //     // refreshMessages(token);
    //   }
    // }, chatRefreshDelay);
    // Unmount
    return () => {
      // console.log('Interval cleared...');
      clearInterval(intervalRef.current);
    };
  }, []);

  const fetchMessages = () => {
    const headers = { 'Authorization': 'Bearer ' + token };
    // setLoading(true);
    axios.get(baseurl + '/public-chat/formatted/last-days/' + chatDays, { headers })
      .then((response) => {
        setLoading(false);
        if (response.status == 200) {
          const data = response.data;
          if (data.length > 0) {
            lastId = data[0]._id;
          }
          // Required for Live AWS Database
          // data.forEach((item) => item.createdAt = convertUTCDateToLocalDate(new Date(item.createdAt)));
          // data.push({
          //   _id: 0,
          //   text: 'Welcome to SportsGeek Public Chat',
          //   // createdAt: new Date(),
          //   system: true
          // });
          // setMessages(data);
          fetchContestLog(data);
        } else {
          showSweetAlert('warning', 'Unable to fetch data!', 'Unable to fetch old Chats.');
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        showSweetAlert('error', 'Network Error', errorMessage);
      });
  };

  const fetchContestLog = (chatData) => {
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/contest-log/formatted/last-days/' + chatDays, { headers })
      .then((response) => {
        if (response.status == 200) {
          const logData = response.data;
          if (logData.length > 0) {
            lastLogId = logData[0]._id.substr(1);
          }
          // Required for Live AWS Database
          // logData.forEach((item) => item.createdAt = convertUTCDateToLocalDate(new Date(item.createdAt)));
          // console.log('chat data : ');
          // console.log(chatData);
          // console.log(typeof(chatData));
          // console.log('Log data : ');
          // console.log(logData);
          // console.log(typeof(logData));
          const finalData = chatData.concat(logData);
          // console.log('Final Data : ');
          // console.log(finalData);
          // Sor Data on date
          finalData.sort((a, b) => {
            const val1 = new Date(a.createdAt);
            const val2 = new Date(b.createdAt);
            if(val1 < val2){
              return 1;
            }
            if(val1 > val2){
              return -1;
            }
            return 0;
          });
          // console.log('Final Data after sorting : ');
          // console.log(finalData);
          finalData.push({
            _id: 0,
            text: 'Welcome to SportsGeek Chat',
            // createdAt: new Date(),
            system: true
          });
          setMessages(finalData);
        } else {
          showSweetAlert('warning', 'Unable to fetch data!', 'Unable to fetch old Chats.');
        }
      })
      .catch((error) => {
        console.log(error);
        showSweetAlert('error', 'Network Error', errorMessage);
      });
  };

  const refreshMessages = () => {
    console.log('Refresh in PublicChatScreen');
    // if(lastId && lastResponseArrived){
    //   const headers = { 'Authorization': 'Bearer ' + token };
    //   // setLoading(true);
    //   lastResponseArrived = false;
    //   axios.get(baseurl + '/public-chat/formatted/after-id/' + lastId, { headers })
    //     .then((response) => {
    //       setLoading(false);
    //       lastResponseArrived = true;
    //       if (response.status == 200) {
    //         const newData = response.data;
    //         if (newData.length > 0) {
    //           // setLastId(newData[0]._id);
    //           lastId = newData[0]._id;
    //           // Required for Live AWS Database
    //           // newData.forEach((item) => item.createdAt = convertUTCDateToLocalDate(new Date(item.createdAt)));
    //           // setMessages(data => [...newData, ...data]);
    //           setMessages(data => newData.concat( data.filter(value => typeof(value._id) === 'number')) );
    //         }
    //       } else {
    //         showSweetAlert('warning', 'Unable to fetch data!', 'Unable to fetch old Chats.');
    //       }
    //     })
    //     .catch((error) => {
    //       setLoading(false);
    //       lastResponseArrived = true;
    //       showSweetAlert('error', 'Network Error', errorMessage);
    //     });
    // }
  };

  const refreshContestLog = (chatData) => {

  }

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
        <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
        {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
        <View>
          <Text>Refresh</Text>
        </View>
        <GiftedChat
          messages={messages}
          onSend={newMessage => handleSend(newMessage[0])}
          user={{ _id: userId }}
          renderUsernameOnMessage={true}
          showAvatarForEveryMessage={true}
          maxInputLength={1000}
          renderAvatarOnTop={true}
          scrollToBottom={true}
          // renderSystemMessage= {(a) => {
          //   console.log('-----');
          //   console.log(a);
          //   return (
          //     <Text>A system message</Text>
          //   );
          // }}
          // shouldUpdateMessage= {(a) => {
          //   console.log('update : ', a);
          // }}
        />
      </>
    );
  } else {
    // return (<Text>Loading...</Text>);
    return null;
  }
}

export default PublicChatScreen;