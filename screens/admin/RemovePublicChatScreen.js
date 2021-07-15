import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    LogBox,
    ActivityIndicator,
    Alert,
    Animated,
    Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

import showSweetAlert from '../../helpers/showSweetAlert';
import { baseurl, errorMessage } from '../../config';

// https://github.com/jemise111/react-native-swipe-list-view/blob/master/SwipeListExample/examples/swipe_value_based_ui.js

const RemovePublicChatScreen = ({ navigation }) => {

    const [data, setData] = useState([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [waiting, setWaiting] = React.useState(false);

    useEffect(async () => {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        fetchChatData(token);
    }, []);

    const fetchChatData = (token) => {
        let days = 30;
        // setWaiting(true);
        const headers = { 'Authorization': 'Bearer ' + token }
        axios.get(baseurl + '/public-chat/last-days/' + days, { headers })
            .then(response => {
                // setWaiting(false);
                setLoading(false);
                if (response.status == 200) {
                    // response.data.forEach((item) => item.key = item.publicChatId);
                    // console.log(response.data);
                    setData(response.data);
                }
                else {
                    showSweetAlert('error', 'Network Error', errorMessage);
                }
            })
            .catch(error => {
                // setWaiting(false);
                setLoading(false);
                showSweetAlert('error', 'Network Error', errorMessage);
            });
    }

    // const updateUser = (userId) => {
    //     let userStatus = true;
    //     setWaiting(true);
    //     const headers = { 'Authorization': 'Bearer ' + token }
    //     axios.put(baseurl + '/users/' + userId + '/update-status/true', {}, { headers })
    //         .then((response) => {
    //             setWaiting(false);
    //             if (response.status == 200) {
    //                 showSweetAlert('success', 'Success', 'User Approved');
    //                 displayUser(token);
    //             }
    //             else {
    //                 showSweetAlert('error', 'Error', 'Failed to update Status. Please try again...');
    //             }
    //         })
    //         .catch((error) => {
    //             setWaiting(false);
    //             console.log(error)
    //             showSweetAlert('error', 'Error', 'Failed to update Status. Please try again...');
    //         });
    // }

    // const getConfirmation = (userId, username) =>
    //     Alert.alert(
    //         "Account Approval Confirmation",
    //         "Do you really want to activate the account of " + username + "  ?",
    //         [
    //             {
    //                 text: "Cancel"
    //             },
    //             {
    //                 text: "OK",
    //                 onPress: () => { updateUser(userId) }
    //             }
    //         ]
    //     );

    const closeRow = (rowMap, rowKey) => {
        console.log('closeRow');
        console.log(rowMap, rowKey);
        // if (rowMap[rowKey]) {
        //     rowMap[rowKey].closeRow();
        // }
    };

    const deleteRow = (rowMap, rowKey) => {
        console.log('deleteRow');
        console.log(rowMap, rowKey);
        // closeRow(rowMap, rowKey);
        // const newData = [...listData];
        // const prevIndex = listData.findIndex(item => item.key === rowKey);
        // newData.splice(prevIndex, 1);
        // setListData(newData);
    };

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    const onSwipeValueChange = swipeData => {
        console.log('onSwipeValueChange');
        console.log(swipeData);
        // const { key, value } = swipeData;
        // rowSwipeAnimatedValues[key].setValue(Math.abs(value));
    };

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <Text>Left</Text>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item.key)}
            >
                <Animated.View
                    style={[
                        styles.trash,
                        // {
                        //     transform: [
                        //         {
                        //             scale: rowSwipeAnimatedValues[
                        //                 data.item.key
                        //             ].interpolate({
                        //                 inputRange: [45, 90],
                        //                 outputRange: [0, 1],
                        //                 extrapolate: 'clamp',
                        //             }),
                        //         },
                        //     ],
                        // },
                    ]}
                >
                    <Icon name="delete" color="#FFF" size={25} />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#19398A" size={40} style={{ marginLeft: 20, marginTop: 10 }} /></TouchableOpacity>
            {/* <Text>Remove Public Chat</Text> */}
            <Spinner visible={waiting} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
            {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
            <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
            <SwipeListView
                data={data}
                renderItem={(data, rowMap) => (
                    <View style={styles.rowFront}>
                        <Text>{data.item.message}</Text>
                    </View>
                )}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={75}
                rightOpenValue={-150}
                keyExtractor={(item, index) => item.publicChatId}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={onRowDidOpen}
                onSwipeValueChange={onSwipeValueChange}
            />
        </View>
    );
};

export default RemovePublicChatScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    trash: {
        height: 25,
        width: 25,
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
});