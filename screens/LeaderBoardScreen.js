import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, RefreshControl, ActivityIndicator, ScrollView } from "react-native";
// import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
// import Svg, { Ellipse } from "react-native-svg";
// import {
//   Avatar
// } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Avatar } from "react-native-elements";
import { useTheme } from 'react-native-paper';
import axios from 'axios';

import showSweetAlert from '../helpers/showSweetAlert';
import getColor from '../helpers/getColor';
import { baseurl, errorMessage } from '../config';

function LeaderBoard(props) {

  const [data, setData] = useState([]);
  const [contestData, setContestData] = useState([]);
  const [userId, setUserId] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const { colors } = useTheme();

  useEffect(async () => {
    const token = await AsyncStorage.getItem('token');
    setToken(token);
    const userId = await AsyncStorage.getItem('userId');
    setUserId(userId);
    fetchData(token);
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // console.log('Refreshing...');
    // fetchData(token);
  }, []);

  const fetchData = (token) => {
    console.log('fetchData');
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/users/statistics', { headers })
      .then((response) => {
        if (response.status == 200) {
          setData(response.data);
          // fetchContestData(response.data, token);
          setLoading(false);
          setRefreshing(false);
        } else {
          setData([]);
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        showSweetAlert('error', 'Network Error', errorMessage);
      });
  }

  const fetchContestData = (data, token) => {
    console.log('fetchContestData');
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/users/future-contest', { headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          setContestData(response.data);
          let contestData = response.data;
          data.forEach((item) => {
            let obj = contestData.find(o => o.userId == item.userId);
            if (obj)
              item.totalWinningPoints += obj.contestPoints;
          });
          // setData(data);
          data.sort((obj1, obj2) => {
            if (obj1.totalWinningPoints < obj2.totalWinningPoints) {
              return 1;
            }
            else if (obj1.totalWinningPoints > obj2.totalWinningPoints) {
              return -1;
            }
            return 0;
          });
          console.log(data);
          setData(data);
          console.log('setData');
        } else {
          setContestData([]);
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        showSweetAlert('error', 'Network Error', errorMessage);
      });
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl enabled={true} refreshing={refreshing} onRefresh={onRefresh} />} >
      {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
      {/* <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={[styles.popular, { width: 100 }]}>Top Users</Text>
        <TouchableOpacity style={{ marginTop: 15 }} onPress={() => setRefreshing(true)}>
          <FontAwesome
            name="refresh"
            color={colors.text}
            size={20}
          />
        </TouchableOpacity>
      </View> */}
      <View style={styles.rectStackRow}>
        { data.length >= 2 && <TopUser rank="2" data={data[1]} boxStyle={styles.box1} />}
        { data.length >= 1 && <TopUser rank="1" data={data[0]} boxStyle={styles.box2} />}
        { data.length >= 3 && <TopUser rank="3" data={data[2]} boxStyle={styles.box3} />}
      </View>
      <View style={styles.listContainer}>
        <View style={styles.headingRow}>
          <Text style={styles.headingCol1}>Rank</Text>
          <Text style={styles.headingCol2}>User</Text>
          <Text style={styles.headingCol3}>Points</Text>
        </View>
        {
          data && data.map((item, index) => {
            const mystyle = item.userId == userId ? styles.bgDark : styles.bgLight;
            return (
              <View style={[styles.card, mystyle]} key={item.userId}>
                <Text style={[styles.carditem, styles.rank]}>{index + 1}</Text>
                {
                  item.profilePicture != '' ?
                  (<Avatar
                      size="small"
                      rounded
                      source={{
                        uri: item.profilePicture
                      }}
                  />) :
                  (<Avatar
                      size="small"
                      rounded
                      title={item.firstName.substr(0, 1) + item.lastName.substr(0, 1)}
                      containerStyle={{ backgroundColor: getColor(item.firstName) }}
                  />)
                }
                <Text style={[styles.carditem, styles.name]}>{item.firstName + " " + item.lastName}</Text>
                <Text style={[styles.carditem, styles.points]}>{item.availablePoints}</Text>
              </View>
            )
          })
        }
        {/* <View style={{ height: 50 }}></View> */}
      </View>
    </ScrollView>
  );
}

export default LeaderBoard;

const TopUser = (props) => {
  const data = props.data;
  const rank = props.rank;
  const avatarSize = rank == 3 ? 'medium' : 'large';

  return (
    <View style={[styles.box, props.boxStyle]}>
      <View style={styles.ellipse}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>{rank}</Text>
      </View>
      {
        data.profilePicture != '' ?
        (<Avatar
          size={avatarSize}
          rounded
          source={{
              uri: data.profilePicture
          }}
          containerStyle={{ marginTop: 10 }}
        />) :
        (<Avatar
          size={avatarSize}
          rounded
          title={data.firstName.substr(0, 1) + data.lastName.substr(0, 1)}
          // activeOpacity={0.7}
          containerStyle={{ marginTop: 10, backgroundColor: getColor(data.firstName) }}
        />)
      }
      <Text style={styles.boxUsername}>{data.firstName + " " + data.lastName}</Text>
      <Text style={styles.boxPoints}>{data.availablePoints}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: "rgba(241,241,241,1)"
  },
  ellipse: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: '#19398A',
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#62B1F6',
    position: 'absolute',
    right: 5,
    top: -20
  },
  rectStackRow: {
    display: "flex",
    height: 170,
    flexDirection: "row",
    justifyContent: 'space-around',
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    alignItems: 'flex-end'
  },
  box: {
    width: '32%',
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#19398A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  box1: {
    height: 140
  },
  box2: {
    height: 160
  },
  box3: {
    height: 120
  },
  boxUsername: {
    color: "#212121",
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  boxPoints: {
    color: "#121212",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: 'center',
  },
  popular: {
    color: '#000',
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10
  },
  listContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: 10
  },
  headingRow: {
    width: '100%',
    height: 35,
    // backgroundColor: "rgba(25,57,138,1)",
    backgroundColor: '#1f4bb9',
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 5,
    display: 'flex',
    flexDirection: "row",
    marginTop: 5,
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    color: '#000',
    fontSize: 20,
    alignItems: 'center',
    fontWeight: 'bold'
  },
  headingCol1: {
    width: '20%',
    color: '#000',
    paddingLeft: 10
  },
  headingCol2: {
    width: '60%',
    color: '#000'
  },
  headingCol3: {
    width: '20%',
    color: '#000',
    textAlign: 'right',
    paddingRight: 8
  },
  card: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    marginTop: 7,
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bgLight: {
    backgroundColor: "#E6E6E6",
  },
  bgDark: {
    backgroundColor: '#87CEFA'
  },
  carditem: {
    color: "#121212",
    fontSize: 18,
    fontWeight: "bold",
    display: 'flex',
    justifyContent: 'space-between',
    //    textAlign: 'center'
  },
  rank: { 
    width: 40,
    textAlign: 'center'
  },
  name : { 
    width: '65%', 
    fontSize: 17,
    paddingLeft: 7
  },
  points: {
    textAlign: 'right',
    paddingRight: 8
  },
});