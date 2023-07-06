import React from 'react';
import ReactDOM from 'react-dom';
import { Map, Marker } from 'react-amap';
import { Button, Input, message } from 'antd';
import Css from './SetShop.module.scss';
import Geolocation from 'react-amap-plugin-geolocation';

class Amap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 设置坐标点，就会在地图上显示一个 标记点
      markerPosition: {},
      areaCode: this.props.areaCode,
    };
    // 高德地图 Marker 实例
    this.markerInstance = undefined;
    // 高德地图 Map 实例
    this.mapInstance = undefined;

    this.amapEvents = {
      created: mapInstance => {
        this.mapInstance = mapInstance;
        window.AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.CitySearch'], () => {
          // 实例化Autocomplete
          const autoOptions = {
            city: this.state.areaCode,
            citylimit: true, //是否强制限制在设置的城市内搜索
            input: 'amapInput',
          };
          const autoComplete = new window.AMap.Autocomplete(autoOptions);
          // 无需再手动执行search方法，autoComplete会根据传入input对应的DOM动态触发search

          const placeSearch = new window.AMap.PlaceSearch({
            map: mapInstance,
          });

          // 监听下拉框选中事件
          window.AMap.event.addListener(autoComplete, 'select', e => {
            // TODO 针对选中的poi实现自己的功能
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name);
            const messageAds = e.poi; // 下拉位置信息
            console.log('下拉位置信息', messageAds);
            if (!messageAds.location) {
              message.error('该地址无详细定位');
              const p = {
                lat: null,
                lng: null,
                keyword: messageAds.name,
              };
              this.props.getPosition(p);
              return;
            }
            this.setState(
              {
                markerPosition: {
                  lat: messageAds.location ? messageAds.location.lat : null,
                  lng: messageAds.location ? messageAds.location.lng : null,
                  companyArea: messageAds.district,
                  storeAddress: messageAds.name,
                  doorplate: messageAds.address.length ? messageAds.address : null,
                  adcode: messageAds.adcode,
                  keyword: messageAds.name,
                },
                keyword: messageAds.name,
              },
              () => {
                this.props.getPosition(this.state.markerPosition);
              }
            );
          });
        });
        // 实例点击事件
        // mapInstance.on('click', e => {
        //   const { markerPosition } = this.state;
        //   markerPosition.lat = e.lnglat.getLat();
        //   markerPosition.lng = e.lnglat.getLng();
        //   this.setState({
        //     markerPosition
        //   }, () => {
        //     this.props.getPosition(this.state.markerPosition);
        //   })
        // });
      },
    };
  }
  componentDidMount() {
    this.editMap();
  }
  componentDidUpdate(prevProps) {
    // 切换城市后重新加载实例
    const { areaCode } = this.props;
    if (this.props.areaCode !== prevProps.areaCode) {
      if (areaCode) {
        this.setState(
          {
            areaCode,
          },
          () => {
            this.amapEvents.created();
          }
        );
      }
    }
  }
  editMap() {
    const { editList } = this.props;
    if (editList) {
      this.setState({
        keyword: editList.storeAddress,
      });
    }
  }
  getareaText(e) {
    const keyword = e.target.value;
    const { markerPosition } = this.state;
    markerPosition.keyword = keyword;
    this.setState(
      {
        keyword,
        markerPosition,
      },
      () => {
        this.props.getPosition(this.state.markerPosition);
      }
    );
  }
  render() {
    const aMapkey = '7cba21a0f5af41ac2d93e1691798f0d5';
    const { editList } = this.props;
    const { keyword } = this.state;
    const pluginProps = {
      enableHighAccuracy: true, //是否使用高精度定位，默认:true
      timeout: 100, //超过10秒后停止定位，默认：无穷大
      maximumAge: 0, //定位结果缓存0毫秒，默认：0
      convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
      showButton: true, //显示定位按钮，默认：true
      buttonPosition: 'RB', //定位按钮停靠位置，默认：'LB'，左下角
      showMarker: true, //显示定位点，默认：true
      showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
      panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
      zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
      extensions: 'all',
    };
    const markerEvents = {
      created: markerInstance => {
        this.markerInstance = markerInstance;
      },
      click: e => {
        console.log(e);
      },
    };
    console.log(this.state.areaCode);
    return (
      <div>
        <Input
          onChange={this.getareaText.bind(this)}
          value={keyword}
          id="amapInput"
          className={Css.widthinput}
          placeholder="请输入详细位置"
        />
        <div>在搜索中选择地址</div>
        <div className={Css.gdmap}>
          <Map
            zoomEnable={false} //禁止放大缩小
            dragEnable={true} //禁止拖动
            // plugins={['ToolBar']}
            events={this.amapEvents}
            amapkey={aMapkey}
            center={this.state.markerPosition}
          >
            <Geolocation ref={locat => (this.mapLocation = locat)} {...pluginProps} />
            <Marker clickable={true} events={markerEvents} position={this.state.markerPosition} />
          </Map>
        </div>
      </div>
    );
  }
}

export default Amap;
