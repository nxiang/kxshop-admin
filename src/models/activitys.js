export default {
  namespace: 'activitys',
  state: {
    stepPage: 0,
    activityId: false,
    lotteryItem: false, // 设置奖项页：如果有值则为修改
    phoneData: {},
    losingLotteryName: '谢谢参与',
    losingLotteryHint: '你和幸运只是一念之差',
    losingLotteryImage: 'https://img.kxll.com/admin_manage/nisimg_7_202034.png',
  },
  reducers: {
    'step page': function(state, action) {
      let page = state.stepPage + 1;
      if (action.payload) {
        page = action.payload;
      }
      if (page > 3) {
        // 到头重置
        page = 0;
      }
      return {
        ...state,
        stepPage: page,
      };
    },
    'step prev': function(state, action) {
      const page = state.stepPage - 1;
      return {
        ...state,
        stepPage: page,
      };
    },
    'activity id': function(state, action) {
      return {
        ...state,
        activityId: action.payload,
      };
    },
    'lottery item info': function(state, action) {
      return {
        ...state,
        lotteryItem: action.payload,
      };
    },
    'phone data': function(state, action) {
      return {
        ...state,
        phoneData: {
          ...state.phoneData,
          ...action.payload,
        },
      };
    },
    'losing lottery name': function(state, action) {
      return {
        ...state,
        losingLotteryName: action.payload,
      };
    },
    'losing lottery hint': function(state, action) {
      return {
        ...state,
        losingLotteryHint: action.payload,
      };
    },
    'losing lottery image': function(state, action) {
      return {
        ...state,
        losingLotteryImage: action.payload,
      };
    },
    'revert default data': function(state, action) {
      return {
        stepPage: 0,
        activityId: false,
        lotteryItem: false, // 设置奖项页：如果有值则为修改
        phoneData: {},
        losingLotteryName: '谢谢参与',
        losingLotteryHint: '你和幸运只是一念之差',
        losingLotteryImage: 'https://img.kxll.com/admin_manage/nisimg_7_202034.png',
      };
    },
  },
};
