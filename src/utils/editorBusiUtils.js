export const getPropertiesArrData = data => {
  let tmp = {
    hasPdTb: true,
    hasPdLR: true,
    hasRadius: true
  }
  let keyValue = {
    1: 'hasPdLR',
    2: 'hasPdTb',
    3: 'hasRadius',
  }
  data.map(item => {
    // enum Link to picPropertiesArr
    tmp[keyValue[item.id]] = item.value == 1
  })

  return tmp
}

export const getRecommdTitleSetting = ({ itemSubTitle, itemTitleColor }) => {
  let tmp = {
    subTitleShow: itemSubTitle == 1
  }
  let keyValue = {}
  if (tmp.subTitleShow) {
    keyValue = {
      1: 'titleDefaultColor',
      2: 'titleFocusColor',
      3: 'subTitleDefaultColor',
      4: 'subTitleFocusColor',
      6: 'subTitleBgColor'
    }
  } else {
    keyValue = {
      1: 'titleDefaultColor',
      2: 'titleFocusColor',
      5: 'lineColor'
    }
  }
  itemTitleColor && itemTitleColor.forEach(item => {
    // enum Link to recommondItemTitleColor
    if (!keyValue[item.id]) return

    if ([5, 6].includes(parseInt(item.id))) {
      tmp[keyValue[item.id]] = {
        background: `rgba(${ item.color.r }, ${ item.color.g }, ${ item.color.b }, ${ item.color.a })`
      }
    } else {
      tmp[keyValue[item.id]] = {
        color: `rgba(${ item.color.r }, ${ item.color.g }, ${ item.color.b }, ${ item.color.a })`
      }
    }
  })
  if (tmp.subTitleFocusColor) {
    tmp.subTitleFocusColor = { ...tmp.subTitleFocusColor, ...tmp.subTitleBgColor }
    delete tmp.subTitleBgColor
  }
  return tmp
}

export default { getPropertiesArrData, getRecommdTitleSetting }