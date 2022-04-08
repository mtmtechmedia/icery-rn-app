import React from 'react'
import { ScrollView, Text, View, TouchableOpacity, Image, Linking } from 'react-native';
import { eventContent } from './Style'
import moment from 'moment'

function EventContent({ navigation, route }) {
    const event = route.params.event; // 接收活動資料

    const OpenUrl = (link, type) => {
        link && Linking.openURL( // 確認網址非null則開啟網頁
            type === 'location' ? 'https://www.google.com.tw/maps/place/' + link : link // 若是地點則導向Google map
        )
    }

    return (
        <ScrollView
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			vertical={true}
            stickyHeaderIndices={[0]}
		>
            <TouchableOpacity activeOpacity={1} onPress={() => {navigation.goBack()}}>
                <View style={{borderBottomWidth: 0.5, borderBottomColor: '#00000020', backgroundColor: 'white'}}>
                    <Text allowFontScaling={false} style={{fontSize: 18, padding: 5, fontWeight: 'bold'}}>返回</Text>
                </View>
            </TouchableOpacity>
            {event &&
            <View style={{padding: 10, marginBottom: 5, textAlign: 'justify',}}>
                <View style={eventContent.section}>
                    <Image 
                        source={{uri: event?.ImageFile}}
                        style={{height: 200, borderRadius: 10,}}
                    />
                    <Text allowFontScaling={false} style={eventContent.title}>{event?.Caption}</Text>
                </View>
                
                <View style={eventContent.section}>
                    <Text allowFontScaling={false} style={eventContent.hint}>可點擊資訊</Text>
                    <Text allowFontScaling={false} style={eventContent.content} onPress={() => OpenUrl(event?.TicketPurchaseLink)}>售票網址: {event?.TicketPurchaseLink}</Text>
                    <Text allowFontScaling={false} style={eventContent.content} onPress={() => OpenUrl(event?.WebsiteLink, 'location')}>活動地點/平台: {event?.Venue}</Text>
                    <Text allowFontScaling={false} style={eventContent.content} onPress={() => OpenUrl(event?.WebsiteLink)}>活動網址: {event?.WebsiteLink}</Text>
                    <Text allowFontScaling={false} style={eventContent.content} onPress={() => OpenUrl(event?.YoutubeLink)}>Youtube影片網址: {event?.YoutubeLink}</Text>
                    <Text allowFontScaling={false} style={eventContent.content} onPress={() => OpenUrl(event?.RelatedLink)}>相關網址: {event?.RelatedLink}</Text>

                    <Text allowFontScaling={false} style={eventContent.hint}>其他活動基本資訊</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>分類: {event?.Category}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>活動單位: {event?.Company}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>活動起始日期時間: {moment(event?.StartDate).format('Y年MM月DD日 - HH:mm')}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>活動結束日期時間: {moment(event?.EndDate).format('Y年MM月DD日 - HH:mm')}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>場次起始日期時間: {moment(event?.SessionStartDate).format('Y年MM月DD日 - HH:mm')}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>場次結束日期時間: {moment(event?.SessionEndDate).format('Y年MM月DD日 - HH:mm')}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>售票資訊: {event?.TicketType}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>票價: {event?.TicketPrice}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>活動聯絡人: {event?.ContactPerson}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>活動電話: {event?.ContactTe}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>發佈日期: {event?.CreateDate}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>縣市名: {event?.City}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>區域名: {event?.Area}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>場次地址: {event?.Address}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>經度: {event?.Longitude}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>緯度: {event?.Latitude}</Text>
                    <Text allowFontScaling={false} style={eventContent.content}>活動介紹: {event?.Introduction}</Text>
                </View>
            </View>
            }
        </ScrollView>
     );
}

export default EventContent