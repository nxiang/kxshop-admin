// 全局 G2 设置

import { getBizCharts } from "@/utils/compatible";

const { track, setTheme } = getBizCharts()

track(false);

const config = {
  defaultColor: '#1089ff',
  shape: {
    interval: {
      fillOpacity: 1,
    },
  },
};

setTheme(config);
