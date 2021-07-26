import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, Icon, ScrollView, TouchableOpacity } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './CarouselCardItem';
import data from '../data';
import { Card } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';
import ScheduleScreen from './ScheduleScreen';
// import { Container, Header, Content, CardItem, Thumbnail, Left, Body } from 'native-base';
import { AuthContext } from '../App';
// const HomeStack = createStackNavigator();

const HomeScreen = ({ navigation }) => {

  const [index, setIndex] = React.useState(0);
  const isCarousel = React.useRef(null);

  const { loginState } = React.useContext(AuthContext);
  console.log('Home Screen : ');
  console.log(loginState);

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
      {/* <Text style={styles.text_header}>Live Cricket Score</Text>
      <TouchableOpacity style={styles.rect}>
        <Text style={styles.date}>Date</Text>
        <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.ellipseRow}>
            <Card.Image style={styles.ellipse} />
            <Text style={styles.mI}>Team 1</Text>
          </View>
          <View style={styles.loremIpsumColumn}>
            <Text style={styles.vs}>VS</Text>
          </View>
          <View style={styles.rightteam}>
            <Text style={styles.eng}>Team 2</Text>
            <Card.Image style={styles.ellipse1} />
          </View>
        </View>
        <View style={{ height: 40 }}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Venue</Text>
        </View>
        <Card.Divider />
        <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <Text style={{ textAlign: 'left', fontSize: 18, paddingLeft: 20, fontWeight: 'bold', width: '50%' }}>Live Score:{" "}</Text>
          <Text style={{ textAlign: 'right', fontSize: 18, paddingRight: 20, fontWeight: 'bold', width: '50%' }}>Overs:{" "}</Text>
        </View>
      </TouchableOpacity> */}
      <View style={styles.container}>
        <Text style={styles.text_header}>Cricket News</Text>
        <Carousel
          layout="tinder"
          layoutCardOffset={9}
          ref={isCarousel}
          data={data}
          renderItem={CarouselCardItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          onSnapToItem={(index) => setIndex(index)}
          useScrollView={true}
        />
        <Pagination
          dotsLength={data.length}
          activeDotIndex={index}
          carouselRef={isCarousel}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)'
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          tappableDots={true}
        />
      </View>
      <View style={{ paddingBottom: 20 }}></View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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