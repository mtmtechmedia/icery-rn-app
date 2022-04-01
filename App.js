import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image, 
  Modal
} from 'react-native';
import { styles, modalStyle } from './Style'
import axios from 'axios';
import moment from 'moment'
import _ from 'lodash'
import { DATA } from './TestData' // 測試用資料


const App = () => {

  useEffect(() => {
    fetchData()
  }, [])

  const API_URL = 'https://cultureexpress.taipei/OpenData/Event/C000003';
  // events初始狀態設定空array
  const [events, setEvents] = useState([]);
  const [eventsGroupByArea, setEventsGroupByArea] = useState([]);
  const [areaFilter, setAreaFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // 透過API取得資料
  const fetchData = async () => {
    const { data } = await axios.get(API_URL);
    setEvents(data);
    // 根據區域進行分類，另外存一個useState
    let grouped = _.groupBy(data, 'Area');
    setEventsGroupByArea(Object.entries(grouped));

    // 測試用的資料 TestData.js
    // setEvents(DATA);
    //let grouped = _.groupBy(DATA, 'Area');
    //setEventsGroupByArea(Object.entries(grouped));

    setIsLoading(false)
  };

  const renderEvents = ({ item }) => {
    let startTime =  moment(item?.StartDate).format('Y年MM月DD日 - HH:mm')
    let endTime =  moment(item?.EndDate).format('Y年MM月DD日 - HH:mm')
    let timeDisplay = moment(item?.EndDate).format('YMMDDHHmm') === moment(item?.StartDate).add(1, 'days').add(-1, 'minutes').format('YMMDDHHmm') ?
                      // 判斷是否為當天整天的活動
                      moment(item?.StartDate).format('Y年MM月DD日') + '一整天的活動'
                      // 若否則印出活動始末時間
                      : startTime + ' ~ ' + endTime

    return(
      <View style={styles.item}>
        <Text style={styles.title}>{item?.Caption}</Text>

        <Image 
          source={{uri: item?.ImageFile}}
          style={styles.eventImage}
        />

        <View style={styles.areaAndPriceSection}>
          <Text style={styles.priceText}>是時候在</Text>
          <Text style={styles.area}>{item?.Area}</Text>
          <Text style={styles.priceText}>{item?.TicketPrice ? '買' : '拿'}張</Text>
          {/* 有些票價沒有填寫，所以用免費標示 */}
          <Text style={styles.price}>{item?.TicketPrice ? item?.TicketPrice + '元' : '免費'}</Text>
          <Text style={styles.priceText}>的票了</Text>
        </View>

        <View style={styles.timeSection}>
          <Text style={styles.time}>活動時間</Text>
          <Text style={styles.time}>{timeDisplay}</Text>
        </View>
      </View>
    )
  }

  const HeaderInfo = () => {
    // 這裡因為Object.entries的關係，將資料分類成新的陣列，因此用key去印出名稱與數量 ex: ["區域", [活動]]
    return(
      <ScrollView
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={false}
        horizontal={true}
      >
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Text>全部</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setAreaFilter('')}>
          <Text>重置</Text>
        </TouchableOpacity>

        {eventsGroupByArea && eventsGroupByArea.map((category, key) => {
          return (
            <TouchableOpacity key={key} style={styles.filterButton} onPress={() => setAreaFilter(category[0])}>
              <Text style={styles.filterButtonText}>
                {category[0]} ({Object.values(category)[1].length})
              </Text>
            </TouchableOpacity>
          )
        })}

        <View style={modalStyle.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={filterModalVisible}
              onRequestClose={() => setFilterModalVisible(!filterModalVisible)}>
              <View style={modalStyle.centeredView}>
                <View style={modalStyle.modalView}>
                  <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                    <TouchableOpacity style={modalStyle.buttonClose} onPress={() => setFilterModalVisible(!filterModalVisible)}>
                      <Text>關閉</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton} onPress={() => setAreaFilter('')}>
                      <Text>重置</Text>
                    </TouchableOpacity>

                    {eventsGroupByArea && eventsGroupByArea.map((category, key) => {
                      let categoryName
                      {/* 這裡設定未填寫活動地區的活動則跳過迴圈 */}
                      if (category[0] === 'null' || category[0] === '') { 
                        return false 
                      } else {
                        return (
                          <TouchableOpacity key={key} style={styles.filterButton} onPress={() => {setAreaFilter(category[0]); setFilterModalVisible(!filterModalVisible)}}>
                            <Text style={styles.filterButtonText}>
                              {category[0]} ({Object.values(category)[1].length})
                            </Text>
                          </TouchableOpacity>
                        )
                      }
                    })}
                  </View>
                </View>
              </View>
            </Modal>
          </View>
      </View>
      </ScrollView>
    )
  }

  return (
    !isLoading && 
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        // 在這裡添加data filter
        data={events.filter(event => event?.Area && event?.Area.includes(areaFilter))}
        renderItem={renderEvents}
        progressViewOffset={50}
        refreshing
        // nestedScrollEnabled
        // keyExtractor={item => item?.ID}
        ListHeaderComponent={<HeaderInfo />}
        ListEmptyComponent={<Text allowFontScaling={false}>資料讀取中... (fetching...)</Text>}
      />
    </SafeAreaView>
  );
};

export default App;
