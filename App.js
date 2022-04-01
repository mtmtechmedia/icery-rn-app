import React, { useEffect, useState, useRef } from 'react';
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
    fetchData() // 一次性或與資料
  }, [])

  const API_URL = 'https://cultureexpress.taipei/OpenData/Event/C000003'; // 資料來源
  
  const [events, setEvents] = useState([]); // events初始狀態設定空array
  const [eventsGroupByArea, setEventsGroupByArea] = useState([]); // 根據區域進行分類
  const [areaFilter, setAreaFilter] = useState([]); // 當下區域篩選
  const [isLoading, setIsLoading] = useState(true); // 載入狀態
  const [filterModalVisible, setFilterModalVisible] = useState(false); // 顯示全部區域的popup

  const flatListRef = useRef(); // 綁定flatlist來scroll to top

  // 透過API取得資料
  const fetchData = async () => {
    const { data } = await axios.get(API_URL); // 透過axios來fetch資料
    setEvents(data); // 設定資料
    
    let grouped = _.groupBy(data, 'Area'); // 根據Area這個key進行分類
    setEventsGroupByArea(Object.entries(grouped)); // 根據區域進行分類，另外存一個useState

    // 測試用的資料 TestData.js
    // setEvents(DATA);
    //let grouped = _.groupBy(DATA, 'Area');
    //setEventsGroupByArea(Object.entries(grouped));

    setIsLoading(false); // 完成資料fetching後解除loading狀態
  };

  const renderEvents = ({ item }) => {
    let startTime =  moment(item?.StartDate).format('Y年MM月DD日 - HH:mm'); // 透過moment統一時間格式
    let endTime =  moment(item?.EndDate).format('Y年MM月DD日 - HH:mm'); // 透過moment統一時間格式
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
          <Text style={styles.priceText}>的門票了</Text>
        </View>

        <View style={styles.timeSection}>
          <Text style={styles.time}>活動時間</Text>
          <Text style={styles.time}>{timeDisplay}</Text>
        </View>
      </View>
    )
  }

  const ScrollToTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 }); // 移動到頂部的功能，因為太長而且多個地方要用就另外寫成function了
  }

  const MultipleFilter = (array, areas) => {
    let result = 0; // 計算符合數量
    areas && areas.forEach((area) => {
      result = result + array.includes(area); // 用includes判斷存在與否
    });
    return result !== 0 // 回報true / false
  }

  const HeaderInfo = () => {
    return(
      <>
      <View style={styles.header}>
        <View style={styles.sticky}>
          <TouchableOpacity style={modalStyle.buttonClose} onPress={() => setFilterModalVisible(true)}>
            <Text>全部</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[modalStyle.buttonClose, {borderRightWidth: 0.5, borderRightColor: '#DDDDDD'}]} onPress={() => {setAreaFilter([]); ScrollToTop()}}>
            <Text>重置</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsHorizontalScrollIndicator={true}
          showsVerticalScrollIndicator={false}
          horizontal={true}
        >
          {eventsGroupByArea && eventsGroupByArea.map((areaName, key) => {
                  console.log('areaFilter.indexOf(areaName[0])', areaFilter.indexOf(areaName[0]))
            {/* 這裡設定未填寫活動地區的活動則跳過迴圈不印出來 */}
            if (areaName[0] === 'null' || areaName[0] === '') { 
              return false 
            } else {
              return (
                <TouchableOpacity key={key} style={[styles.filterButton, {backgroundColor: areaFilter && areaFilter.includes(areaName[0]) ? '#D9BF8C80' : '#D9BF8C'}]} 
                  onPress={() => {
                    setAreaFilter(areaFilter.includes(areaName[0]) ? // 確認是否已選取
                      // areaFilter.splice(areaFilter.indexOf(areaName[0]), 1) // 原本用這段來移除，但是splice會改變狀態，所以無法使用，改下面方式
                      [...areaFilter.slice(0, areaFilter.indexOf(areaName[0])).concat(areaFilter.slice(areaFilter.indexOf(areaName[0]) + 1))] // 移除filter中已選取的地區
                      : prev => [...prev, areaName[0]]); // 新增已選取地區至filter
                    ScrollToTop();
                  }}
                >
                  <Text style={styles.filterButtonText}>
                    {/* 這裡因為Object.entries的關係，將資料分類成新的陣列，因此用key去印出名稱與數量 ex: ["區域", [活動]] */}
                    {areaName[0]} ({Object.values(areaName)[1].length}) 
                  </Text>
                </TouchableOpacity>
              )
            }
          })}
        </ScrollView>
      </View>

      <View style={modalStyle.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={filterModalVisible}
          onRequestClose={() => setFilterModalVisible(!filterModalVisible)}>
          <View style={modalStyle.centeredView}>
            <View style={modalStyle.modalView}>
              <Text>目前顯示活動地區：{areaFilter.length === 0 ? '未篩選' : areaFilter}</Text>

              <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                <TouchableOpacity style={modalStyle.buttonClose} onPress={() => setFilterModalVisible(!filterModalVisible)}>
                  <Text>關閉</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modalStyle.buttonClose} onPress={() => {setAreaFilter([]); ScrollToTop()}}>
                  <Text>重置</Text>
                </TouchableOpacity>

                {eventsGroupByArea && eventsGroupByArea.map((areaName, key) => {
                  
                  {/* 這裡設定未填寫活動地區的活動則跳過迴圈不印出來 */}
                  if (areaName[0] === 'null' || areaName[0] === '') { 
                    return false 
                  } else {
                    return (
                      <TouchableOpacity key={key} style={[styles.filterButton, {backgroundColor: areaFilter && areaFilter.includes(areaName[0]) ? '#D9BF8C80' : '#D9BF8C'}]} 
                        onPress={() => {
                          setAreaFilter(areaFilter.includes(areaName[0]) ? // 確認是否已選取
                            [...areaFilter.slice(0, areaFilter.indexOf(areaName[0])).concat(areaFilter.slice(areaFilter.indexOf(areaName[0]) + 1))] // 移除filter中已選取的地區
                            : prev => [...prev, areaName[0]]); // 新增已選取地區至filter
                          ScrollToTop();
                        }}
                      >
                        <Text style={styles.filterButtonText}>
                          {areaName[0]} ({Object.values(areaName)[1].length})
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
      </>
    )
  }

  return (
    !isLoading && 
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        ref={flatListRef}
        // 在這裡添加data filter
        data={areaFilter.length === 0 ? events : events.filter(event => event?.Area && MultipleFilter(event?.Area, areaFilter))}
        renderItem={renderEvents}
        progressViewOffset={50}
        refreshing
        stickyHeaderIndices={[0]}
        ListHeaderComponent={<HeaderInfo />}
        ListEmptyComponent={<Text allowFontScaling={false}>資料讀取中...</Text>}
      />
    </SafeAreaView>
  );
};

export default App;
