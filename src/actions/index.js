import {
  createAction
} from 'redux-actions';

const namespace = 'activitys'
export const stepPage = createAction(`${namespace  }/step page`)
export const stepPrev = createAction(`${namespace  }/step prev`)
export const activityId = createAction(`${namespace  }/activity id`)
export const lotteryItem = createAction(`${namespace  }/lottery item info`)
export const phoneData = createAction(`${namespace  }/phone data`)
export const revertData = createAction(`${namespace  }/revert default data`)
