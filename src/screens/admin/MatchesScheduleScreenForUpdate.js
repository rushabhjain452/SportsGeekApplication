import React, { Component, useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Alert, ActivityIndicator, StatusBar, RefreshControl } from "react-native";
import { Card, ListItem, Button } from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";
// import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';

import formatDate from '../../helpers/formatDate';
import showSweetAlert from '../../helpers/showSweetAlert';
import { baseurl, errorMessage } from '../../config';
import { AuthContext } from '../../../App';

function MatchesScheduleScreenForUpdate({ navigation }) {
  const { loginState } = React.useContext(AuthContext);
  const token = loginState.token;

  // const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = React.useState(false);

  //   const noOfFutureBets = 5;

  useEffect(() => {
    fetchData();
  }, [refreshing]);


  const fetchData = () => {
    const headers = { 'Authorization': 'Bearer ' + token };
    setLoading(true);
    axios.get(baseurl + '/matches', { headers })
      .then(response => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          setData(response.data);
        }
        else {
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch(error => {
        setLoading(false);
        setRefreshing(false);
        showSweetAlert('error', 'Network Error', errorMessage);
      })
  }

  const handleCardClick = (matchId) => {
    navigation.navigate('MatchesScreen', { updateMatchId: matchId });
  }

  const onRefresh = React.useCallback(() => {
    // console.log('After refresh : ');
    setRefreshing(true);
    fetchData();
    // wait(2000).then(() => setRefreshing(false));
  }, []);

  const deleteMatch = (id) => {
    setLoading(true);
    const headers = { 'Authorization': 'Bearer ' + token };
    setLoading(true);
    axios.delete(baseurl + '/matches/' + id, { headers })
      .then((response) => {
        setLoading(false);
        if (response.status == 200) {
          showSweetAlert('success', 'Success', 'Match deleted successfully.');
          fetchData();
        }
        else {
          showSweetAlert('error', 'Error', 'Failed to delete Match. Please try again...');
        }
      })
      .catch((error) => {
        setLoading(false);
        showSweetAlert('error', 'Error', 'Failed to delete Match. Please try again...');
      })
  }


  const getConfirmation = (matchId) =>
    Alert.alert(
      "Delete Confirmation",
      "Do you really want to delete the Match ?",
      [
        {
          text: "Cancel"
        },
        {
          text: "OK",
          onPress: () => { deleteMatch(matchId) }
        }
      ]
    );

  return (
    <ScrollView keyboardShouldPersistTaps="handled" style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Spinner visible={loading} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
      <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
      <TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#19398A" size={40} style={{marginLeft: 20,marginTop: 10,width:100}} /></TouchableOpacity>
      <Text style={styles.text_header}>Matches Schedule</Text>
      {/* {loading == true && (<ActivityIndicator size="large" color="#19398A" />)} */}
      {
        data && data.map((item, index) => (
          <View style={styles.rect} key={item.matchId}>
            <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.date}>{formatDate(item.startDatetime)}</Text>
              {/* <TouchableOpacity onPress={() => { getConfirmation(item.matchId) }} style={{ textAlign: 'right' }} ><Text ><Icon name="delete-circle-outline" color="#19398A" size={40} /></Text></TouchableOpacity> */}
            </View>
            <TouchableOpacity onPress={() => { handleCardClick(item.matchId) }} >
              <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.ellipseRow}>
                  <Card.Image style={styles.ellipse} source={{ uri: item.team1Logo }} />
                  <Text style={styles.mI}>{item.team1Short}</Text>
                </View>
                <View style={styles.loremIpsumColumn}>
                  <Text style={styles.vs}>VS</Text>
                </View>
                <View style={styles.rightteam}>
                  <Text style={styles.eng}>{item.team2Short}</Text>
                  <Card.Image style={styles.ellipse1} source={{ uri: item.team2Logo }} />
                </View>
              </View>
              <View style={{ height: 40 }}>
                <Text style={{ textAlign: 'center', fontSize: 16 }}>{item.venue}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))
      }
      <View style={{ height: 20 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "rgba(255,255,255,1)"
  },
  rect: {
    width: '95%',
    height: 150,
    backgroundColor: "#E6E6E6",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 11,
  },
  ellipse: {
    width: 61,
    height: 61,
    marginTop: 0,
    borderRadius: 30,
    marginLeft: 7
  },
  mI: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    marginLeft: 11,
    marginTop: 20,
    fontWeight: "bold"
  },
  date: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    textAlign: "center",
    paddingTop: 7,
    paddingLeft: '30%'
  },
  vs: {
    fontFamily: "roboto-regular",
    color: "#121212",
    // marginTop: 22,
    // marginLeft: 33,
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
  },
  time: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    marginTop: 18,
    marginLeft: 13
  },
  loremIpsumColumn: {
    // width: 95,
    // marginLeft: 15,
    display: 'flex',
    // flexDirection: 'row',
    // alignItems: 'center',
    // height: 150,
    marginTop: 10,
    // textAlign: "center",
    // alignSelf: "center"
    // flex: 2
  },
  eng: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    marginLeft: 20,
    marginTop: 20,
    fontWeight: "bold"
  },
  ellipse1: {
    width: 61,
    height: 61,
    marginLeft: 18,
    marginTop: 0,
    borderRadius: 30
  },
  ellipseRow: {
    // height: 95,
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 10,
    // alignSelf: "flex-start"
    // flex: 4
  },
  rect1: {
    width: 407,
    height: 142,
    backgroundColor: "#E6E6E6",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    marginTop: 12,
    marginLeft: 10
  },
  ellipse2: {
    width: 61,
    height: 61,
    marginTop: 15,
    borderRadius: 30
  },
  mI3: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    marginLeft: 11,
    marginTop: 37,
    fontWeight: "bold"
  },
  loremIpsum3: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16
  },
  vs1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 22,
    marginLeft: 33
  },
  loremIpsum4: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    marginTop: 18,
    marginLeft: 19
  },
  loremIpsum3Column: {
    width: 95,
    marginLeft: 23
  },
  eng1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    marginLeft: 20,
    marginTop: 37,
    fontWeight: "bold"
  },
  ellipse3: {
    width: 61,
    height: 61,
    marginLeft: 18,
    marginTop: 17,
    borderRadius: 30
  },
  ellipse2Row: {
    height: 95,
    flexDirection: "row",
    marginTop: 26,
    marginLeft: 10,
    marginRight: 10
  },
  iplSchedule2021: {
    fontFamily: "roboto-regular",
    color: "rgba(00,00,00,1)",
    fontSize: 24,
    textAlign: "center",
    marginTop: -336,
  },
  rightteam: {
    // flex: 4
    display: 'flex',
    flexDirection: "row",
    marginTop: 10,
    marginRight: 10,
  },
  container2: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  text_header: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: "center",
  },
  spinnerTextStyle: {
    color: '#FFF'
  }
});

export default MatchesScheduleScreenForUpdate;
