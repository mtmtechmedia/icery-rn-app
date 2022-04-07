import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, ScrollView, Text, View, FlatList, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { styles, modalStyle } from './Style'
import axios from 'axios';
import moment from 'moment'
// import _ from 'lodash' // 棄用
// import { MINI_DATA, DATA } from './TestData' // 測試用資料


const Events = ({navigation}) => {
  useEffect(() => {
    fetchData() // 一次性獲取資料
  }, [])

  const API_URL = 'https://cultureexpress.taipei/OpenData/Event/C000003'; // 資料來源
  
  const [events, setEvents] = useState([]); // events初始狀態設定空array
  const [eventsGroupByArea, setEventsGroupByArea] = useState([]); // 根據區域進行分類
  const [areaFilter, setAreaFilter] = useState([]); // 當下區域篩選
  const [searchText, setSearchText] = useState(''); // 活動標題搜尋
  const [isLoading, setIsLoading] = useState(true); // 載入狀態
  const [filterModalVisible, setFilterModalVisible] = useState(false); // 顯示全部區域的popup

  const flatListRef = useRef(); // 綁定flatlist來scroll to top

  // 透過API取得資料
  const fetchData = async () => {
    const { data } = await axios.get(API_URL); // 透過axios來fetch資料
    let usedData = data
    
    // 測試用的資料 TestData.js
    // let usedData = DATA
    // let usedData = MINI_DATA

    setEvents(usedData); // 設定資料
    let grouped = groupBy(usedData, 'Area'); // 根據Area這個key進行分類
    setEventsGroupByArea(grouped); // 根據區域進行分類，另外存一個useState

    setIsLoading(false); // 完成資料fetching後解除loading狀態
  };

  const groupBy = (eventsData) => { // 取代lodash的groupBy功能
    return eventsData.reduce((allEvent, currentEvent) => { // (整筆活動資料(events), 當下單筆活動資料(event))
      (allEvent[currentEvent?.Area] = allEvent[currentEvent?.Area] || []).push(currentEvent) // 重組單個活動區域為新陣列 中正區Array: [{活動Object 1}, {活動Object 2}]}
      return allEvent // 最後組成Object return，資料格式為 Object {"單個活動區域 a": [{活動Object a1}, {活動Object a2}], "單個活動區域 b": [{活動Object b1}, {活動Object b2}]}
    }, {});
  };

  const MultipleFilter = (eventObject, areas) => {
    let areaIncluded = false; // 預設不符合
    areas && areas.forEach((area) => {
      if (eventObject?.Area === area) { // 判斷是否符合所選活動地區
        areaIncluded = true; // 符合則轉成true
      }
    });

    let areaResult = areaFilter.length !== 0 ? areaIncluded : true // 統整活動地區篩選結果 -> 邏輯: 1.有無進行篩選? 有: 篩選結果(true/false) 無: true(全部印出)

    let searchResult = searchText ? eventObject?.Caption.includes(searchText) : true // 統整活動標題篩選結果 -> 邏輯: 1.有無進行篩選? 有: 篩選結果(true/false) 無: true(全部印出)
    
    return areaResult && searchResult // 回報true / false (因為任一篩選器若未篩選會得到true，因此double true才算符合結果，若有任一項不符合篩選則false)
  }

  const ScrollToTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 }); // 移動到頂部的功能，因為太長而且多個地方要用就另外寫成function了
  }

  const HeaderInfo = () => {
    return(
      <>
      <View style={styles.header}>
        <View style={styles.sticky}>
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
            {eventsGroupByArea && Object.keys(eventsGroupByArea).map((areaName, key) => { // 單筆map資料形式 ex:(中正區, index)
              // 這裡設定未填寫活動地區的活動則跳過迴圈不印出來
              if (areaName?.Area === 'null' || areaName?.Area === '') { // 判斷活動地區名稱是否非法
                return false // 不處理非法活動地區之活動
              } else {
                return (
                  <TouchableOpacity key={key} style={[styles.filterButton, {backgroundColor: areaFilter && areaFilter.includes(areaName) ? '#D9BF8C80' : '#D9BF8C'}]} 
                    onPress={() => {
                      setAreaFilter(areaFilter.includes(areaName) ? // 確認是否已選取
                        [...areaFilter.slice(0, areaFilter.indexOf(areaName)).concat(areaFilter.slice(areaFilter.indexOf(areaName) + 1))] // 移除filter中已選取的地區
                        : prev => [...prev, areaName]); // 新增已選取地區至filter
                      ScrollToTop();
                    }}
                  >
                    <Text style={styles.filterButtonText}>
                      {/* 資料形式 ex: 中正區 (中正區活動數量) */}
                      {areaName} ({eventsGroupByArea[areaName].length}) 
                    </Text>
                  </TouchableOpacity>
                )
              }
            })}
          </ScrollView>
        </View>

        <View style={[styles.sticky, {justifyContent: 'space-around', alignItems: 'center'}]}>
          {/* 活動標題搜尋框 */}
          <TextInput style={[styles.input, {width: '80%'}]} onChangeText={(text) => setSearchText(text)} placeholder='搜尋活動標題' defaultValue={searchText} />

          {/* 清除活動標題篩選 */}
          <TouchableOpacity style={modalStyle.buttonClose} onPress={() => {setSearchText('');}}>
              <Text style={{fontSize: 15}}>清除</Text>
          </TouchableOpacity>
        </View>
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

                {eventsGroupByArea && Object.keys(eventsGroupByArea).map((areaName, key) => { // 單筆map資料形式 ex:(中正區, index)
                  // 這裡設定未填寫活動地區的活動則跳過迴圈不印出來
                  if (areaName?.Area === 'null' || areaName?.Area === '') { // 判斷活動地區名稱是否非法
                    return false // 不處理非法活動地區之活動
                  } else {
                    return (
                      <TouchableOpacity key={key} style={[styles.filterButton, {backgroundColor: areaFilter && areaFilter.includes(areaName) ? '#D9BF8C80' : '#D9BF8C'}]} 
                        onPress={() => {
                          setAreaFilter(areaFilter.includes(areaName) ? // 確認是否已選取
                            [...areaFilter.slice(0, areaFilter.indexOf(areaName)).concat(areaFilter.slice(areaFilter.indexOf(areaName) + 1))] // 移除filter中已選取的地區
                            : prev => [...prev, areaName]); // 新增已選取地區至filter
                          ScrollToTop();
                        }}
                      >
                        <Text style={styles.filterButtonText}>
                          {/* 資料形式 ex: 中正區 (中正區活動數量) */}
                          {areaName} ({eventsGroupByArea[areaName].length}) 
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

        <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate("EventContent", {event: item})} >
          <View style={styles.areaAndPriceSection}>
            <Text style={[styles.price, {fontSize: 15, marginVertical: 0}]}>詳細資訊</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
// console.log('eventsGroupByArea', typeof(eventsGroupByArea), eventsGroupByArea);
  return (
    !isLoading && // fetch完畢才render
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        ref={flatListRef}
        // 在這裡添加data filter
        data={areaFilter.length === 0 && !searchText ? // 判斷是否進行篩選
                events // 沒有進行篩選的狀態
                 // 有任意篩選的狀態，另外先過濾沒有活動地區或活動標題的活動
                : events.filter(event => event?.Area && event?.Caption && MultipleFilter(event, areaFilter))
              }
        renderItem={renderEvents}
        progressViewOffset={50}
        refreshing
        stickyHeaderIndices={[0]}
        ListHeaderComponent={<HeaderInfo />}
        ListEmptyComponent={<Text allowFontScaling={false}>沒有資料耶...</Text>}
      />
    </SafeAreaView>
  );
};

export default Events;
