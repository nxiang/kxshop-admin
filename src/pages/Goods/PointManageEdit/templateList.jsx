import React from 'react';
import { Link } from '@umijs/max';
import Css from './style.module.scss';

export default ({ templateInfo }) => {
  return (
    <>
      {
        templateInfo &&
        templateInfo.freightAreaList &&
        templateInfo.freightAreaList.map((item, index) => {
          return (
            <div key={index} className={Css.freightBox}>
              <div className={Css.freightTitle}>
                <span>模板规则:</span>
                {index === 0 ? (
                  <Link
                    to={`/setting/addlogistics/${templateInfo.freightId}`}
                    target="_blank"
                  >
                    查看详情
                  </Link>
                ) : null}
              </div>
              <div>配送区域: {item.areaNames}</div>
              {templateInfo.freeFlag ? (
                <div>
                  <br />
                  包邮
                </div>
              ) : (
                <div>
                  续重规则:
                  {templateInfo.calcType === 'number' ? (
                    <span>
                      {item.firstItem}件内{item.firstPrice / 100}元,每增加
                      {item.nextItem}件,加{item.nextPrice / 100}元
                    </span>
                  ) : null}
                  {templateInfo.calcType === 'weight' ? (
                    <span>
                      {item.firstItem / 1000}kg内{item.firstPrice / 100}元,每增加
                      {item.nextItem / 1000}kg,加{item.nextPrice / 100}元
                    </span>
                  ) : null}
                  {templateInfo.calcType === 'volume' ? (
                    <span>
                      {item.firstItem / 1000000}m<sup>3</sup>内{item.firstPrice / 100}
                      元,每增加{item.nextItem / 1000000}m<sup>3</sup>,加
                      {item.nextPrice / 100}元
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          );
        })
      }
    </>
  )
}