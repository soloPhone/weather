import React, { Component } from 'react'
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  FlatList,
  AsyncStorage
} from 'react-native'
import ContentArea from '../../widget/ContentArea'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
// import { setCityList } from '../../store/actions'
import { getHotCities, getCityByKeyWord } from '../../api'
import { ScrollView } from 'react-native'
export interface Iprops {
  [key: string]: any
}
export interface Istate {
  hotCities: Icity[]
  modalVisible: boolean
  inputText: string
  matchedCities: Icity[]
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
  timer: number = -1
  state: Istate = {
    hotCities: [],
    modalVisible: false,
    inputText: '',
    matchedCities: []
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

  // 更新文本框的值
  handleChange(text: string) {
    if (text.trim()) {
      this.setState({ inputText: text })
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        try {
          const {
            data: { HeWeather6 }
          } = await getCityByKeyWord({ location: text })
          const { status, basic } = HeWeather6[0]
          if (status === 'ok') {
            this.setState({
              matchedCities: basic
            })
          }
        } catch (err) {
          console.log(err)
        }
      }, 300)
    } else {
      this.setState({ inputText: '' })
    }
  }

  // 选择查询出的城市
  async handleConfirmCity(cityInfo: Icity) {
    try {
      const data = AsyncStorage.setItem(
        'searchHistory',
        JSON.stringify([cityInfo])
      )
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { navigation } = this.props
    const { hotCities, inputText, matchedCities } = this.state
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <ContentArea style={{ marginHorizontal: 15 }}>
          <View style={styles.searchBox}>
            <View style={{ flex: 1, height: 40 }}>
              <TextInput
                enablesReturnKeyAutomatically
                style={styles.textInput}
                value={inputText}
                onSubmitEditing={() =>
                  console.log('--------------', this.state.inputText)
                }
                onChangeText={this.handleChange.bind(this)}
              />
            </View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={1}
            >
              <Text>取消</Text>
            </TouchableOpacity>
          </View>
          {inputText ? (
            <ScrollView alwaysBounceVertical>
              <FlatList
                data={matchedCities}
                renderItem={({ item }) => (
                  <View
                    style={{
                      borderBottomWidth: 0.5,
                      borderColor: '#e5e5e5',
                      paddingTop: 4
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={this.handleConfirmCity.bind(this, item)}
                    >
                      <Text>
                        {item.location},{item.parent_city},{item.admin_area},
                        {item.cnty}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </ScrollView>
          ) : (
            <View>
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
                    onPress={() => this.handleDelSearchRecord()}
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
            </View>
          )}
        </ContentArea>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  textInput: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    fontSize: 16,
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
