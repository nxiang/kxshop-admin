import pathToRegexp from 'path-to-regexp';
import { urlToList } from '../_utils/pathTools';

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menus
 */
export const getFlatMenuKeys = menuData => {
  let keys = [];
  menuData.forEach(item => {
    keys.push(item.path);
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
  });
  return keys;
};
export const getMenuMatches = (flatMenuKeys, path) =>{
  const result = flatMenuKeys.filter(item => {
    if (item) {
      const flag = pathToRegexp(item).test(path);
      return flag
    }
    return false;
  })
  // console.log('getMenuMatches123',flatMenuKeys,path,result)
  return result
}
/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
export const getDefaultCollapsedSubMenus = props => {
  const {
    router:{ location: { pathname } },
    flatMenuKeys,
  } = props;
  // const { location } = window
  // const { pathname } = location
  return urlToList(pathname)
    .map(item => getMenuMatches(flatMenuKeys, item)[0])
    .filter(item => item)
    .reduce((acc, curr) => [...acc, curr], ['/']);
};
