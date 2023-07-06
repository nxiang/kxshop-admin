import React, { useState, useEffect } from 'react';
import Css from './PhotoRecommend.module.scss';
import reactCSS from 'reactcss';
import { getRecommdTitleSetting } from '@/utils/editorBusiUtils';

export default function PhotoRecommend(props) {
  const { itemData, itemStyle, itemNum, itemSubTitle, itemTitleColor, itemType } = props;
  console.log('itemData', itemData);
  console.log('itemStyle', itemStyle);
  const [current, setCurrent] = useState(0);

  let {
    subTitleShow,
    titleDefaultColor,
    titleFocusColor,
    subTitleDefaultColor,
    subTitleFocusColor,
    lineColor,
  } = getRecommdTitleSetting({ itemSubTitle, itemTitleColor });

  const selfStyles = reactCSS({
    default: {
      titleDefaultColor,
      titleFocusColor,
      subTitleDefaultColor,
      subTitleFocusColor,
      lineColor,
    },
  });

  useEffect(() => {
    setCurrent(0);
  }, [itemNum]);

  function currentClick(index) {
    setCurrent(index);
  }

  return (
    <div className={Css['photo-recommend-box']}>
      {itemData && itemData.length > 1 && (
        <div className={Css['recommend-header']}>
          {itemData.map((item, index) => {
            return (
              <div
                className={Css['recommend-header-item']}
                key={index}
                onClick={currentClick.bind(this, index)}
              >
                <p
                  className={
                    current === index
                      ? `${Css['header-text']} ${Css['bold-text']}`
                      : `${Css['header-text']}`
                  }
                  style={
                    current === index ? selfStyles.titleFocusColor : selfStyles.titleDefaultColor
                  }
                >
                  {item.title}
                </p>
                {subTitleShow && (
                  <p
                    className={Css['header-subText']}
                    style={
                      current === index
                        ? selfStyles.subTitleFocusColor
                        : selfStyles.subTitleDefaultColor
                    }
                  >
                    {item.subTitle}
                  </p>
                )}
                {current === index && !subTitleShow && (
                  <div className={Css['border-line']} style={selfStyles.lineColor} />
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className={Css['recommend-content']}>
        {itemData[current] && itemData[current].data == '' && itemStyle === 1 && (
          <div className={Css['coupon-one-default-img']}>
            <img
              className={Css['default-img']}
              src="https://img.kxll.com/admin_manage/icon/decoration_default_img.png"
              alt=""
            />
          </div>
        )}
        {itemData[current] && itemData[current].data == '' && itemStyle === 2 && (
          <div className={Css['coupon-two-default-img']}>
            <div className={Css['two-default-item']}>
              <img
                className={Css['default-img']}
                src="https://img.kxll.com/admin_manage/icon/decoration_default_img.png"
                alt=""
              />
            </div>
            <div className={Css['two-default-item']}>
              <img
                className={Css['default-img']}
                src="https://img.kxll.com/admin_manage/icon/decoration_default_img.png"
                alt=""
              />
            </div>
          </div>
        )}
        {itemData[current] && itemData[current].data == '' && itemStyle === 3 && (
          <div className={Css['coupon-list-default-img']}>
            <img
              className={Css['default-img']}
              src="https://img.kxll.com/admin_manage/icon/decoration_default_img.png"
              alt=""
            />
          </div>
        )}
        {itemData[current] && itemData[current].data == '' && itemStyle === 4 && (
          <div className={Css['coupon-roll-default-img']}>
            <img
              className={Css['default-img']}
              src="https://img.kxll.com/admin_manage/icon/icon_roll.png"
              alt=""
            />
          </div>
        )}
        {itemData?.length > 0 && itemStyle === 1 && (
          <div>
            {itemData[current] &&
              itemData[current].data.length > 0 &&
              itemData[current].data.map((item, index) => {
                return (
                  <div className={Css['content-one-item']} key={index}>
                    <img className={Css['item-img']} src={item.imageSrc} />
                    <p className={Css['item-title']}>{item.itemName}</p>
                    <p className={Css['item-price']}>
                      {itemData[current]?.couponPrice?.[item.itemId] ||
                      itemData[current]?.couponPrice?.[item.itemId] === 0 ? (
                        <span>
                          券后价：{itemData[current]?.couponPrice[item.itemId]?.toFixed(2)}
                        </span>
                      ) : (
                        <React.Fragment>
                          {itemType == 'integral' ? (
                            <div style={{width:'200px'}}>
                              <span style={{ fontSize: '13px', fontWeiht: 'blod', color: 'red' }}>
                                {item.expendPoint || 0}积分
                              </span>
                              <s style={{ marginLeft: '10px' }}>
                                ¥{Math.floor(item.linePrice || 0 / 100)}
                              </s>
                            </div>
                          ) : (
                            <div>
                              <span>¥</span>
                              <span className={Css['item-price-max']}>
                                {item.salePrice < 100 ? '0' : Math.floor(item.salePrice / 100)}
                              </span>
                              <span>
                                .
                                {String((item.salePrice / 100).toFixed(2)).substring(
                                  String((item.salePrice / 100).toFixed(2)).length - 2
                                )}
                              </span>
                            </div>
                          )}
                        </React.Fragment>
                      )}
                    </p>
                  </div>
                );
              })}
          </div>
        )}
        {itemData?.length > 0 && itemStyle === 2 && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {itemData[current] &&
              itemData[current].data.length > 0 &&
              itemData[current].data.map((item, index) => {
                return (
                  <div className={Css['content-two-item']} key={index}>
                    <div className={Css['item-img-box']}>
                      <img className={Css['item-img']} src={item.imageSrc} alt="" />
                    </div>
                    <p className={Css['item-title']}>{item.itemName}</p>
                    <p className={Css['item-price']}>
                      {itemData[current]?.couponPrice?.[item.itemId] ||
                      itemData[current]?.couponPrice?.[item.itemId] === 0 ? (
                        <span>
                          券后价：{itemData[current]?.couponPrice[item.itemId]?.toFixed(2)}
                        </span>
                      ) : (
                        <React.Fragment>
                          {itemType == 'integral' ? (
                            <div style={{width:'200px'}}>
                              <span style={{ fontSize: '13px', fontWeiht: 'blod', color: 'red' }}>
                                {item.expendPoint || 0}积分
                              </span>
                              <s style={{ marginLeft: '10px' }}>
                                ¥{Math.floor(item.linePrice || 0 / 100)}
                              </s>
                            </div>
                          ) : (
                            <div>
                              <span>¥</span>
                              <span className={Css['item-price-max']}>
                                {item.salePrice < 100 ? '0' : Math.floor(item.salePrice / 100)}
                              </span>
                              <span>
                                .
                                {String((item.salePrice / 100).toFixed(2)).substring(
                                  String((item.salePrice / 100).toFixed(2)).length - 2
                                )}
                              </span>
                            </div>
                          )}
                        </React.Fragment>
                      )}
                    </p>
                  </div>
                );
              })}
          </div>
        )}
        {itemData?.length > 0 && itemStyle === 3 && (
          <div>
            {itemData[current]?.data.length > 0 &&
              itemData[current].data.map((item, index) => {
                return (
                  <div className={Css['content-list-item']} key={index}>
                    <div className={Css['item-img-box']}>
                      <img className={Css['item-img']} src={item.imageSrc} alt="" />
                    </div>
                    <div className={Css['item-content']}>
                      <p className={Css['item-title']}>{item.itemName}</p>
                      <p className={Css['item-price']}>
                        {itemData[current]?.couponPrice?.[item.itemId] ||
                        itemData[current]?.couponPrice?.[item.itemId] === 0 ? (
                          <span>
                            券后价：{itemData[current]?.couponPrice[item.itemId]?.toFixed(2)}
                          </span>
                        ) : (
                          <React.Fragment>
                            {itemType == 'integral' ? (
                              <div style={{width:'200px'}}>
                                <span style={{ fontSize: '13px', fontWeiht: 'blod', color: 'red' }}>
                                  {item.expendPoint || 0}积分
                                </span>
                                <s style={{ marginLeft: '10px' }}>
                                  ¥{Math.floor(item.linePrice || 0 / 100)}
                                </s>
                              </div>
                            ) : (
                              <div>
                                <span>¥</span>
                                <span className={Css['item-price-max']}>
                                  {item.salePrice < 100 ? '0' : Math.floor(item.salePrice / 100)}
                                </span>
                                <span>
                                  .
                                  {String((item.salePrice / 100).toFixed(2)).substring(
                                    String((item.salePrice / 100).toFixed(2)).length - 2
                                  )}
                                </span>
                              </div>
                            )}
                          </React.Fragment>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        {itemData?.length > 0 && itemStyle === 4 && (
          <div className={Css['content-rolling-sliding-box']}>
            <div className={Css['content-rolling-box']}>
              {itemData[current]?.data.length > 0 &&
                itemData[current].data.map((item, index) => {
                  return (
                    <div className={Css['content-rolling-item']} key={index}>
                      <img className={Css['item-img']} src={item.imageSrc} alt="" />
                      <p className={Css['item-title']}>{item.itemName}</p>
                      <p className={Css['item-price']}>
                        {itemData[current]?.couponPrice?.[item.itemId] ||
                        itemData[current]?.couponPrice?.[item.itemId] === 0 ? (
                          <span>
                            券后价：{itemData[current]?.couponPrice[item.itemId]?.toFixed(2)}
                          </span>
                        ) : (
                          <React.Fragment>
                            {itemType == 'integral' ? (
                              <div style={{width:'200px'}}>
                                <span style={{ fontSize: '13px', fontWeiht: 'blod', color: 'red' }}>
                                  {item.expendPoint || 0}积分
                                </span>
                                <s style={{ marginLeft: '2px',color:"#000"}}>
                                  ¥{Math.floor(item.linePrice || 0 / 100)}
                                </s>
                              </div>
                            ) : (
                              <div>
                                <span>¥</span>
                                <span className={Css['item-price-max']}>
                                  {item.salePrice < 100 ? '0' : Math.floor(item.salePrice / 100)}
                                </span>
                                <span>
                                  .
                                  {String((item.salePrice / 100).toFixed(2)).substring(
                                    String((item.salePrice / 100).toFixed(2)).length - 2
                                  )}
                                </span>
                              </div>
                            )}
                          </React.Fragment>
                        )}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
