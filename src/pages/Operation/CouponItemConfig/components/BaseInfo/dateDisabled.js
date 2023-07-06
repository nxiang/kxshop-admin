import moment from 'moment';

export const jugdeTimeDisabledGet = (current, time, time2 = [], type, specTime) => {
  // type 为1 则为开始值 为2 则为结束值
  const [start, end] = time2;
  let bol = false;
  if (type == 1) {
    if (start) bol = current.isAfter(start)
    if (!time) return bol;
    // 开始 需要小于结束时间、不能小于超过结束时间180天
    bol = current.isAfter(time) || current.isBefore(moment(time).subtract(180, 'd'));
  } else if (type == 2) {
    if (end) bol = current.isAfter(end)
    // 如果开始时间不存在则只大于当前时间即可
    if (!time) return bol || current.isBefore(moment());
    // 结束 需要大于开始时间并且大于当前时间、不能大于开始时间超过180天
    bol = current.isBefore(moment()) || current.isBefore(time) || current.isAfter(moment(time).add(180, 'd'));
    // 判断编辑时的end时间
    if (specTime) bol = bol || current.isBefore(specTime)
  }
  return current && bol;
};

export const jugdeTimeDisabledCanUse = (current, time, time2 = [], type, specTime) => {
  // type 为1 则为开始值 为2 则为结束值
  const [start, end] = time2;
  let bol = false;
  if (start || end || time) {
    // 需要大于领取开始的时间
    if (start) bol = current.isBefore(start);

    if (type == 1 && time) {
      // 需要小于可用结束时间
      bol = bol || current.isAfter(time);
    }
    if (type == 2) {
      // 需要大于当前时间
      bol = bol || current.isBefore(moment());
      // 大于可用开始时间
      if (time) bol = bol || current.isBefore(time);
      // 大于领取结束时间
      if (end) bol = bol || current.isBefore(end);
    }
    // 判断编辑时的end时间
    if (specTime) bol = bol || current.isBefore(specTime)
  } else if (!time) {
    if(type==2) return current.isBefore(moment());
    return bol;
  }

  return current && bol;
};
