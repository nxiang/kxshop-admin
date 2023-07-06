import { useMemo, useRef } from 'react'
import { isUndef } from '@/utils/tools'

export default (props) => {
  const { baseInfoData } = props
  /** 因为切换券可用时间会导致baseInfoData数据被替换但Form中的数据还在，特用ref再缓存一份 */
  const voucherInfoRef = useRef({
    couponTimeType: undefined,
    beginTime: undefined,
    endTime: undefined,
    availableBeginTime: undefined,
    availableEndTime: undefined,
    availableDays: undefined,
    daysAvailableAfterReceive: undefined
  })
  /** 券核销信息 */
  const Com = useMemo(() => {
    let begin, end
    const {
      couponTimeType,
      couponUseRule,
      availableBeginTime: beginTime,
      availableEndTime: endTime
    } = baseInfoData || {}
    const couponAvailableTime = couponUseRule?.couponAvailableTime || {}

    const {
      availableDays,
      daysAvailableAfterReceive,
      availableBeginTime,
      availableEndTime
    } = couponAvailableTime

    // 如果数据本身是undefiend则尝试取ref中的数据
    const infoRef = voucherInfoRef.current
    const info = (voucherInfoRef.current = {
      couponTimeType: isUndef(couponTimeType)
        ? infoRef.couponTimeType
        : couponTimeType,
      beginTime: isUndef(beginTime) ? infoRef.beginTime : beginTime,
      endTime: isUndef(endTime) ? infoRef.endTime : endTime,
      availableBeginTime: isUndef(availableBeginTime)
        ? infoRef.availableBeginTime
        : availableBeginTime,
      availableEndTime: isUndef(availableEndTime)
        ? infoRef.availableEndTime
        : availableEndTime,
      daysAvailableAfterReceive: isUndef(daysAvailableAfterReceive)
        ? infoRef.daysAvailableAfterReceive
        : daysAvailableAfterReceive,
      availableDays: isUndef(availableDays)
        ? infoRef.availableDays
        : availableDays
    })

    // 后续数据从ref中取
    if (info.couponTimeType == 1) {
      begin = info.availableBeginTime?.format?.('YYYY-MM-DD')
      end = info.availableEndTime?.format?.('YYYY-MM-DD')
    } else {
      begin = info.beginTime?.format?.('YYYY-MM-DD')
      end = info.endTime?.format?.('YYYY-MM-DD')
    }

    const datas = {
      couponTimeType: info.couponTimeType,
      begin,
      end,
      /** 有效天数 */
      availableDays: info.availableDays,
      /** 领取后多少天生效 */
      daysAvailableAfterReceive: info.daysAvailableAfterReceive
    }

    console.log('mergeInfo', baseInfoData, datas, info)
    return (
      <>
        <h2>券核销信息</h2>
        <div className="ml-8 mb-2">
          <div>
            由于&nbsp;&nbsp;微信商家券&nbsp;&nbsp;限制，系统将&nbsp;&nbsp;根据&nbsp;&nbsp;当前优惠券的可用时间配置，自动调整微信端券核销时间。
          </div>
          {[1].includes(datas.couponTimeType) && (
            <div>
              当前优惠券的可用时间配置为：固定可用时间段，系统将取&nbsp;&nbsp;该固定可用时间段作为&nbsp;&nbsp;微信侧的核销时间。
            </div>
          )}
          {[2, 3].includes(datas.couponTimeType) && (
            <div>
              当前优惠券的可用时间配置为：领券后立即生效、领券X天后生效，系统将取&nbsp;&nbsp;券领取时间&nbsp;&nbsp;作为微信侧的核销时间。
            </div>
          )}
          {[2, 3].includes(datas.couponTimeType) && (
            <div className="text-red-400">
              请确保正常活动时间在领券时间范围内，否则将导致券到期时间不一致。
            </div>
          )}
          <div className="w-96 bg-gray-200 px-8 py-1.5 mt-2 rounded">
            {datas.begin && datas.end && (
              <span>
                券核销时间：
                {`${datas.begin} —— ${datas.end}`}
              </span>
            )}
            {datas.couponTimeType == 2 && datas.availableDays && (
              <div>领券后立即生效，有效期{datas.availableDays}天</div>
            )}
            {datas.couponTimeType == 3 &&
              datas.daysAvailableAfterReceive &&
              datas.availableDays && (
                <div>
                  领券{datas.daysAvailableAfterReceive}
                  天后生效，有效期{datas.availableDays}天
                </div>
              )}
          </div>
        </div>
      </>
    )
  }, [baseInfoData])
  return Com
}
