import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator, StatusBar } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import axios from 'axios';

import showSweetAlert from '../helpers/showSweetAlert';
import { baseurl, errorMessage, chatRefreshDelay, chatDays } from '../config';
import { convertUTCDateToLocalDate } from '../helpers/dateConversion';

import { AuthContext } from '../../App';

const ChatScreen = () => {
  const { loginState, refreshChatMessages } = React.useContext(AuthContext);
  const token = loginState.token;
  const userId = parseInt(loginState.userId);
  const msgs = loginState.chatMessages;

  const [messages, setMessages] = useState([]);
  // const [lastId, setLastId] = useState(0);
  let lastId = 0;
  let lastResponseArrived = true;
  let lastLogId = 0;

  const [loading, setLoading] = useState(true);

  const intervalRef = useRef();

  useEffect(() => {
    console.log('PublicChat useEffect() called...');
    refreshChatMessages();
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
            if (val1 < val2) {
              return 1;
            }
            if (val1 > val2) {
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
    console.log('Refresh in ChatScreen');
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

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon='send-circle' size={34} color='#19398A' />
        </View>
      </Send>
    );
  }

  const scrollToBottomComponent = () => {
    return (
      <View style={styles.scrollToBottomComponentContainer}>
        <IconButton icon='chevron-double-down' size={28} color='#FFF' style={{ backgroundColor: '#19398A' }} />
      </View>
    );
  }

  if (userId != 0) {
    return (
      <>
        <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
        {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
        {/* <View>
          <Text>Refresh</Text>
        </View> */}
        <GiftedChat
          messages={messages}
          onSend={newMessages => handleSend(newMessages[0])}
          user={{ _id: userId }}
          placeholder="Type your message here..."
          alwaysShowSend={true}
          renderSend={renderSend}
          renderUsernameOnMessage={true}
          showAvatarForEveryMessage={true}
          maxInputLength={1000}
          renderAvatarOnTop={true}
          scrollToBottom={true}
          // scrollToBottomStyle={{
          //   backgroundColor: '#19398A',
          // }}
          scrollToBottomComponent={scrollToBottomComponent}
          renderLoading={() => (<ActivityIndicator size="large" color="#19398A" />)}
          renderSystemMessage={(data) => {
            // console.log('-----');
            // console.log(a);
            // console.log(a.currentMessage.text);
            const arr = data.currentMessage.text.split(' -> ');
            return (
              <View style={styles.msgBox}>
                <Text style={styles.msgTitle}>{arr[0]}</Text>
                {arr[1] && <Text style={styles.msgBody}>{arr[1]}</Text>}
              </View>
            );
          }}
          // shouldUpdateMessage= {(a) => {
          //   console.log('update : ', a);
          // }}
          textInputStyle={{
            // backgroundColor: '#E9E9E9',
            marginLeft: 0,
            paddingLeft: 10,
            paddingRight: 10
          }}
        />
      </>
    );
  } else {
    // return (<Text>Loading...</Text>);
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "rgba(255,255,255,1)"
  },
  msgBox: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 3,
    marginBottom: 5,
    marginLeft: 8,
    marginRight: 8,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 10,
    textAlign: 'center',
    // backgroundColor: '#E6E6E6',  // silver
    // backgroundColor: '#BCD4E6',  // sky blue
    // backgroundColor: '#99C1DE',  // sky blue
    // backgroundColor: '#CAF0F8',  // sky blue (good) greenish
    // backgroundColor: '#DFE7FD',  // violet
    // backgroundColor: '#D8E2DC',  // light green (good)
    backgroundColor: '#BDE0FE',  // sky blue (good)
  },
  msgTitle: {
    // width: '100%',
    display: 'flex',
    flexDirection: 'row',
    // alignSelf: 'flex-start',
    alignSelf: 'center',
    // textAlign: 'center',
    marginTop: 1,
    // marginBottom: 5,
    // marginLeft: 8,
    // marginRight: 8,
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 4,
    fontSize: 13,
    fontWeight: 'bold',
    backgroundColor: '#CAF0F8'
  },
  msgBody: {
    textAlign: 'center',
    fontSize: 13,
    // backgroundColor: 'green'
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#E9E9E9',
    // height: 42
  },
  scrollToBottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#19398A'
  },
});

export default ChatScreen;