import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, RefreshControl, ActivityIndicator, TouchableOpacity, ScrollView, StatusBar } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
import {
  Avatar
} from 'react-native-paper';
import { Card } from 'react-native-elements';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import formatDate from '../helpers/formatDate';
import showSweetAlert from '../helpers/showSweetAlert';
import { baseurl, errorMessage } from '../config';
import { AuthContext } from '../../App';

const ResultWithUsersScreen = (props) => {
  const { loginState } = React.useContext(AuthContext);
  const token = loginState.token;
  const username = loginState.username;

  const { matchId } = props.route.params;

  const navigation = useNavigation();

  const [matchData, setMatchData] = useState({});
  const [data, setData] = useState([]);
  const [winnerTeam, setWinnerTeam] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);

  const [team1BetPoints, setTeam1BetPoints] = useState(0);
  const [team2BetPoints, setTeam2BetPoints] = useState(0);

  useEffect(() => {
    fetchMatchData();
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  const fetchMatchData = () => {
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/matches/' + matchId, { headers })
      .then((response) => {
        if (response.status == 200) {
          setMatchData(response.data);
          // setMatchData([]);
          const matchData = response.data;
          if (matchData.winnerTeamId == matchData.team1Id)
            setWinnerTeam(matchData.team1Short);
          else if (matchData.winnerTeamId == matchData.team2Id)
            setWinnerTeam(matchData.team2Short);
          fetchData(matchData);
        } else {
          setMatchData([]);
        }
      })
      .catch((error) => {
        setMatchData([]);
        showSweetAlert('error', errorMessage);
      });
  }

  const fetchData = (matchData) => {
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/matches/' + matchId + '/contest', { headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          setData(response.data);
          const records = response.data;
          let team1points = 0, team2points = 0;
          records.forEach((item, index) => {
            if (item.teamShortName == matchData.team1Short) {
              team1points += item.contestPoints;
            } else if (item.teamShortName == matchData.team2Short) {
              team2points += item.contestPoints;
            }
          });
          setTeam1BetPoints(team1points);
          setTeam2BetPoints(team2points);
        } else {
          console.log(error);
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        console.log(error);
        showSweetAlert('error', 'Network Error', errorMessage);
      });
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#19398A" size={40} style={{marginLeft: 20,marginTop: 10,width:100}} /></TouchableOpacity>
      <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
      {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
      <TouchableOpacity style={styles2.rect}>
        <Text style={styles2.date}>{formatDate(matchData.startDatetime)}</Text>
        <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles2.ellipseRow}>
            <Card.Image style={styles2.ellipse} source={{ uri: matchData.team1Logo }} />
            <Text style={styles2.mI}>{matchData.team1Short}</Text>
          </View>
          <View style={styles2.loremIpsumColumn}>
            <Text style={styles2.vs}>VS</Text>
          </View>
          <View style={styles2.rightteam}>
            <Text style={styles2.eng}>{matchData.team2Short}</Text>
            <Card.Image style={styles2.ellipse1} source={{ uri: matchData.team2Logo }} />
          </View>
        </View>
        <Card.Divider />
        <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <Text style={{ textAlign: 'left', fontSize: 18, paddingLeft: 20, fontWeight: 'bold' }}>{team1BetPoints}</Text>
          <Text style={{ textAlign: 'right', fontSize: 18, paddingRight: 20, fontWeight: 'bold' }}>{team2BetPoints}</Text>
        </View>
        {
          matchData.resultStatus == 1 ?
            (<Text style={{ textAlign: 'center', fontSize: 20, paddingLeft: 20, fontWeight: 'bold', marginTop: 6 }}>Winner : {winnerTeam}</Text>) :
            (<Text style={{ textAlign: 'center', fontSize: 20, paddingLeft: 20, fontWeight: 'bold', marginTop: 6 }}>Match Draw / Canceled</Text>)
        }
      </TouchableOpacity>
      <View>
        <View style={styles.rect3}>
          <View style={styles.rankRow}>
            <Text style={styles.col1}>User</Text>
            <Text style={styles.col2}>Bet Team</Text>
            <Text style={styles.col3}>Points</Text>
            <Text style={styles.col4}>Winning</Text>
          </View>
        </View>
        {
          data.map((item, index) => {
            const mystyle = item.username == username ? styles.bgDark : styles.bgLight;
            return (
              <View style={[styles.card, mystyle]} key={item.contestId}>
                <View style={styles.cardlist}>
                  <View style={styles.ellipse1}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>{item.firstName.substr(0, 1) + item.lastName.substr(0, 1)}</Text>
                  </View>
                  <Text style={[styles.carditem, { width: '42%', fontSize: 17 }]}>{item.firstName + " " + item.lastName}</Text>
                  <Text style={[styles.carditem, { width: '15%' }]}>{item.teamShortName}</Text>
                  <Text style={[styles.carditem, { width: '15%' }]}>{item.contestPoints}</Text>
                  <Text style={[styles.carditem, { width: '15%' }]}>{item.winningPoints}</Text>
                </View>
              </View>
            )
          })
        }
      </View>
      <View style={{ marginTop: 50 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: "rgba(241,241,241,1)"
  },
  ellipse: {
    top: 0,
    left: 84,
    width: 31,
    height: 34,
    position: "absolute",
    opacity: 0.8
  },
  loremIpsum: {
    top: 6,
    left: 95,
    position: "absolute",
    fontFamily: "comic-sans-ms-regular",
    color: "#121212",
    fontSize: 16
  },
  loremIpsum1: {
    top: 6,
    left: 95,
    position: "absolute",
    fontFamily: "times-new-roman-regular",
    color: "#121212",
    fontSize: 20
  },
  rectStack: {
    width: 115,
    height: 140,
    marginTop: 23
  },
  rectStackRow: {
    display: "flex",
    height: 164,
    flexDirection: "row",
    justifyContent: 'space-around',
    marginTop: 30,
    marginLeft: 10,
    marginRight: 7,
  },
  rect: {
    left: 0,
    width: '32%',
    height: 130,
    // position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    // backgroundColor: 'green',
    bottom: 0,
    top: 20,
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 1,
  },
  rect1: {
    width: '32%',
    height: 150,
    // position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    // backgroundColor: 'yellow',
    left: 0,
    bottom: 0,
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 1
  },
  rect2: {
    left: 0,
    width: '32%',
    height: 110,
    // position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    // backgroundColor: 'red',
    bottom: 0,
    top: 40,
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 1
  },
  ellipse1: {
    top: 0,
    left: 78,
    width: 31,
    height: 34,
    position: "absolute",
    opacity: 0.8,
    // marginLeft: 50
  },
  loremIpsum2: {
    top: 6,
    left: 90,
    position: "absolute",
    fontFamily: "times-new-roman-regular",
    color: "#121212",
    fontSize: 18
  },
  rect1Stack: {
    width: 109,
    height: 164,
    marginLeft: 9
  },
  ellipse2: {
    top: 0,
    left: 79,
    width: 31,
    height: 34,
    position: "absolute",
    opacity: 0.8
  },
  loremIpsum3: {
    top: 6,
    left: 91,
    position: "absolute",
    fontFamily: "times-new-roman-regular",
    color: "#121212",
    fontSize: 18
  },
  rect2Stack: {
    width: 110,
    height: 127,
    marginLeft: 6,
    marginTop: 37
  },
  popular: {
    // fontFamily: "times-new-roman-regular",
    color: "rgba(147,147,147,1)",
    fontSize: 18,
    marginTop: 10,
    marginLeft: 19
  },
  rect3: {
    width: '92%',
    height: 37,
    backgroundColor: "rgba(25,57,138,1)",
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 5,
    flexDirection: "row",
    marginTop: 16,
    marginLeft: 19
  },
  col1: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    width: '45%',
    paddingLeft: 50
  },
  col2: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    // marginLeft: 50,
    width: '20%',
    // marginTop: 1
  },
  col3: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    // marginLeft: 127,
    width: '20%'
  },
  col4: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    // marginLeft: 127,
    width: '20%'
  },
  rankRow: {
    height: 18,
    flexDirection: "row",
    flex: 1,
    // marginRight: 57,
    marginLeft: 7,
    marginTop: 11
  },
  rect4: {
    width: '92%',
    height: 60,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 8,
    marginTop: 15,
    marginLeft: 19
  }, // styles for List display
  card: {
    // width: '100%',
    height: 50,
    // backgroundColor: "#E6E6E6",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between',
    //  marginBottom:50
  },
  bgLight: {
    backgroundColor: "#E6E6E6",
  },
  bgDark: {
    // backgroundColor: "#98FB98",
    backgroundColor: '#87CEFA'
  },
  cardlist: {
    display: "flex",
    flexDirection: "row",
    marginTop: 4,
    justifyContent: "space-between",
  },
  ellipse1: {
    width: 40,
    height: 40,
    //   marginTop: 0,
    borderRadius: 100,
    marginLeft: 5,
    justifyContent: 'center',
    backgroundColor: '#e9c46a',

  },
  carditem: {
    color: "#121212",
    fontSize: 18,
    marginLeft: 3,
    marginTop: 5,
    fontWeight: "bold",
    display: 'flex',
    justifyContent: 'space-between',
    //    textAlign: 'center'
  },
  carditemusername: {
    color: "#121212",
    fontSize: 14,
    marginLeft: 3,
    marginTop: 10,
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold'
    //    textAlign: 'center',
    // borderBottomColor: 'green',
    // borderBottomWidth: 2,
    // height: 40,
  },
});

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "rgba(255,255,255,1)"
  },
  rect: {
    width: '95%',
    height: 180,
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

export default ResultWithUsersScreen;
