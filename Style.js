import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row', 
        justifyContent: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 0.5, 
        borderColor: '#DDDDDD', 
    },
    sticky: {
        flexDirection: 'row', 
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRightWidth: 0.5, 
        borderColor: '#DDDDDD', 
    },
    filterButton: {
        borderRadius: 5, 
        // backgroundColor: '#D9BF8C',
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 5,
        margin: 5,
    },
    filterButtonText: {
        // fontWeight: 'bold',
    },
    item: {
        backgroundColor: '#D9BF8C',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 5,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'justify',
    },
    time: {
        fontSize: 13,
    },
    timeSection: {
        marginVertical: 5,
        borderLeftWidth: 2, 
        borderColor: 'black', 
        backgroundColor: '#DDDDDD', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        paddingLeft: 5,
    },
    areaAndPriceSection:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    area: {
        fontSize: 13,
        borderWidth: 0.5, 
        borderColor: "black", 
        backgroundColor: '#DDDDDD', 
        borderRadius: 3, 
        paddingHorizontal: 3, 
        marginHorizontal: 3,
        textAlign: 'center',
    },
    priceText: {
        fontSize: 13,
    },
    price: {
        fontSize: 13,
        borderWidth: 0.5, 
        borderColor: "black", 
        backgroundColor: '#DDDDDD', 
        borderRadius: 3, 
        paddingHorizontal: 3, 
        marginHorizontal: 3,
        textAlign: 'center',
        maxWidth: 150,
    },
    eventImage: {
        height: 150, 
        borderRadius: 10,
    },
});

export const modalStyle = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonClose: {
        borderRadius: 5, 
        backgroundColor: '#DDDDDD',
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 5,
        margin: 5,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
});