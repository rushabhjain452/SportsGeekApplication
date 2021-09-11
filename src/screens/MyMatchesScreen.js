import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TouchableOpacity } from "react-native-gesture-handler";
import { Card } from 'react-native-elements';
import axios from 'axios';

import formatDate from '../helpers/formatDate';
import showSweetAlert from '../helpers/showSweetAlert';
import { baseurl, errorMessage } from '../config';
import { AuthContext } from '../../App';

const Tab = createMaterialTopTabNavigator();

const UpcomingMatches = ({ navigation }) => {
  const { loginState } = React.useContext(AuthContext);
  const token = loginState.token;
  const userId = loginState.userId;

  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // console.log("User Id : "+userId);
    // fetchData();
  }, []);

  const fetchData = () => {
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/users/' + userId + '/upcoming', { headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          setData(response.data);
        } else {
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        showSweetAlert('error', 'Network Error', errorMessage);
      });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
      {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
      {/* {!data && (<Text style={styles.text_header}>Sorry, there are no upcoming matches.</Text>)} */}
      {(!data || (data && data.length < 1)) && (<Text style={styles.text_header}>Sorry, you have not placed future bets on any upcoming matches.</Text>)}
      {
        data && data.map((item, index) => (
          <TouchableOpacity style={styles.rect} key={item.matchId} onPress={() => navigation.navigate('ContestScreen', { matchId: item.matchId })}>
            <Text style={styles.date}>{formatDate(item.startDatetime)}</Text>
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
            <Card.Divider />
            <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Text style={{ textAlign: 'left', fontSize: 18, paddingLeft: 20, fontWeight: 'bold', width: '50%' }}>Bet Team:{" " + item.teamName}</Text>
              <Text style={{ textAlign: 'right', fontSize: 18, paddingRight: 20, fontWeight: 'bold', width: '50%' }}>Bet Points:{" " + item.contestPoints}</Text>
            </View>
          </TouchableOpacity>
        ))
      }
      <View style={{ height: 100 }}></View>
    </ScrollView>
  );
}

const LiveMatches = ({ navigation }) => {
  const { loginState } = React.useContext(AuthContext);
  const token = loginState.token;
  const userId = loginState.userId;

  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // fetchData();
  }, []);

  const fetchData = () => {
    // console.log("U Id : " + userId);
    setLoading(false);
    setRefreshing(false);
    axios.get(baseurl + '/users/' + userId + '/live', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          setData(response.data);
        } else {
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        showSweetAlert('error', 'Network Error', errorMessage);
      });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
      <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
      {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
      {(!data || (data && data.length < 1)) && (<Text style={styles.text_header}>Sorry, there are no live matches running now.</Text>)}
      {
        data && data.map((item, index) => (
          <TouchableOpacity style={styles.rect} key={item.matchId} onPress={() => navigation.navigate('UsersContestForLiveMatch', { matchId: item.matchId })}>
            <Text style={styles.date}>{formatDate(item.startDatetime)}</Text>
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
            <Card.Divider />
            <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Text style={{ textAlign: 'left', fontSize: 18, paddingLeft: 20, fontWeight: 'bold', width: '50%' }}>Bet Team:{" " + item.teamName}</Text>
              <Text style={{ textAlign: 'right', fontSize: 18, paddingRight: 20, fontWeight: 'bold', width: '50%' }}>Bet Points:{" " + item.contestPoints}</Text>
            </View>
          </TouchableOpacity>
        ))
      }
      <View style={{ height: 100 }}></View>
    </ScrollView>
  );
}

const Results = ({ navigation }) => {
  const { loginState } = React.useContext(AuthContext);
  const token = loginState.token;
  const userId = loginState.userId;

  const [result, setResult] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResultData();
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // fetchResultData(userId);
  }, []);

  const fetchResultData = () => {
    setLoading(false);
    setRefreshing(false);
    // console.log("User Id : " + userId);
    axios.get(baseurl + '/users/' + userId + '/result', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          setResult(response.data);
        } else {
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setRefreshing(false);
        showSweetAlert('error', 'Network Error', errorMessage);
      });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
      {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
      {(!result || (result && result.length < 1)) && (<Text style={styles.text_header}>Sorry, there are no results.</Text>)}
      {
        result && result.map((item, index) => (
          <TouchableOpacity style={styles.rect} key={item.matchId} onPress={() => navigation.navigate('ResultWithUsersScreen', { matchId: item.matchId })}>
            <Text style={styles.date}>{formatDate(item.startDatetime)}</Text>
            <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
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
            {/* <View style={{height:40}}>
                <Text style={{textAlign: 'center',fontSize:16}}>Placed Contest : {item.teamName}</Text>
              </View> */}
            <Card.Divider />
            <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Text style={{ textAlign: 'left', fontSize: 16, paddingLeft: 10, fontWeight: 'bold' }}>Bet Team : {item.teamName}</Text>
              <Text style={{ textAlign: 'right', fontSize: 16, paddingRight: 10, fontWeight: 'bold' }}>Bet Points : {item.contestPoints}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
              {
                item.winnerTeamName ?
                  (<Text style={{ textAlign: 'left', fontSize: 16, paddingLeft: 10, fontWeight: 'bold' }}>Winner Team:{" " + item.winnerTeamName}</Text>) :
                  (<Text style={{ textAlign: 'left', fontSize: 16, paddingLeft: 10, fontWeight: 'bold' }}>Match Draw/Canceled</Text>)
              }
              {
                (item.winnerTeamName == null || item.winnerTeamName == item.teamName) ?
                  (<Text style={{ textAlign: 'right', fontSize: 16, paddingRight: 10, fontWeight: 'bold' }}>Winning Points:{" " + item.winningPoints}</Text>) :
                  (<Text style={{ textAlign: 'right', fontSize: 16, paddingRight: 10, fontWeight: 'bold' }}>Losing Points:{" " + item.contestPoints}</Text>)
              }
            </View>
          </TouchableOpacity>
        ))
      }
      <View style={{ marginTop: 100 }}></View>
    </ScrollView>
  );
}

const MyMatchesScreen = () => {
  return (
    <Tab.Navigator initialRouteName="Upcoming">
      <Tab.Screen name="Upcoming" component={UpcomingMatches} />
      <Tab.Screen name="Live" component={LiveMatches} />
      <Tab.Screen name="Results" component={Results} />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "rgba(255,255,255,1)"
  },
  rect: {
    width: '95%',
    height: 200,
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
    paddingTop: 7
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
  }
});
export default MyMatchesScreen;