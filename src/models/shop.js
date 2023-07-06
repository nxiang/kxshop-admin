export default {
  namespace: 'shop',

  state: {
    channelType: 'alipay'
  },

  reducers: {
    setChannelType(state, { payload }) {
      return {
        ...state,
        channelType: payload,
      };
    },
  }
};
