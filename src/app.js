// import { routesAuthority } from './services/menu';
import 'antd/dist/antd.css'
// import moment from 'moment'
// console.log('momentxx123',moment)
export const dva = {
  config: {
    onError(err) {
      err.preventDefault()
    }
  }
}

// let authRoutes = {
//   '/form/advanced-form': { authority: ['admin', 'user'] },
// };

// export function render(oldRender) {
//   routesAuthority().then(response => {
//     if (response && response.success) {
//       authRoutes = response.data;
//     }
//     oldRender();
//   });
// }
