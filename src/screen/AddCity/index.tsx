import React, { Component } from 'react'
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native'
import ContentArea from '../../widget/ContentArea'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Modal from 'react-native-modal'
import Utils from '../../utils/index'
import { getHotCities } from './../../api'
export interface Iprops {
  [key: string]: any
}
export interface Istate {
  hotCities: Icity[]
  modalVisible: boolean
}
export interface Icity {
  cid: string
  location: string
  parent_city: string
  admin_area: string
  cnty: string
  lat: string
  lon: string
  tz: string
  type: string
}
export default class AddCity extends Component<Iprops, Istate> {
  state: Istate = {
    hotCities: [],
    modalVisible: false
  }

  componentDidMount() {
    this.requestHotCities()
  }

  // 请求热门推荐城市
  async requestHotCities() {
    try {
      const { data } = await getHotCities({
        group: 'cn'
      })
      const hotCities = data.HeWeather6[0].basic || []
      this.setState({
        hotCities
      })
      console.log(hotCities)
    } catch (err) {
      console.log(err)
    }
  }

  // 删除搜索记录
  handleDelSearchRecord() {
    Alert.alert('确定删除所有搜索记录？')
    console.log('del record')
  }

  setModalVisible(visible: boolean) {
    this.setState({ modalVisible: visible })
  }

  render() {
    const { navigation } = this.props
    const { hotCities } = this.state
    const deviceWidth = Dimensions.get('window').width
    const deviceHeight = Utils.isIos()
      ? Dimensions.get('window').height
      : require('react-native-extra-dimensions-android').get(
          'REAL_WINDOW_HEIGHT'
        )
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <Modal
          style={{ margin: 0 }}
          isVisible={this.state.modalVisible}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          onBackdropPress={() => this.setState({ modalVisible: false })}
        >
          <View style={{ flex: 1 }}>
            <Text>Hello!</Text>
          </View>
        </Modal>
        <View style={{ marginTop: 100 }} />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => this.setModalVisible(true)}
        >
          <MaterialCommunityIcon
            name="delete-outline"
            size={25}
            style={{ color: '#e4e4e4' }}
          />
        </TouchableOpacity>
        {/* <ContentArea style={{ marginHorizontal: 15 }}>
          <View style={styles.searchBox}>
            <View style={{ flex: 1, height: 30 }}>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => console.log(text)}
              />
            </View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={1}
            >
              <Text>取消</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 15 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Text style={styles.labelText}>搜索记录</Text>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.setModalVisible(true)}
              >
                <MaterialCommunityIcon
                  name="delete-outline"
                  size={25}
                  style={{ color: '#e4e4e4' }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={styles.labelText}>推荐城市</Text>
            <View style={styles.cityList}>
              {hotCities.map((city) => (
                <TouchableOpacity
                  style={styles.city}
                  key={city.cid}
                  onPress={() => console.log(1)}
                >
                  <Text>{city.location}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ContentArea> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInput: {
    paddingVertical: 0,
    paddingHorizontal: 6,
    fontSize: 12,
    marginRight: 10,
    borderColor: '#e5e5e5',
    borderWidth: 1,
    borderRadius: 10
  },
  labelText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333'
  },
  cityList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10
  },
  city: {
    marginRight: 4,
    marginBottom: 5,
    fontSize: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#e9e9e9',
    color: '#999'
  }
})