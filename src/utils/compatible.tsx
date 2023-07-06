// @ts-nocheck
import * as BizCharts from 'bizcharts';
import { parse } from 'query-string';
import {
  useLocation as useUmiLocation,
  useNavigate,
  useParams,
  // useRouteData,
  useAppData,
  // matchRoutes,
} from "@umijs/max";

// console.log('BizCharts123',BizCharts)

/**
 * 给umi的location添加query属性，兼容旧版的umi v3
 * @returns 
 */
export const useLocation = () => {
  const location = useUmiLocation()
  const { search } = location
  // 添加query方法
  location.query = search ? parse(search) : {}
  return location
}

/**
 * umi4 升级 umi5兼容方法
 * 针对classComponent，在props上添加location等api
 * @param Component 
 * @returns 
 */
export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const location = useLocation()
    const navigate = useNavigate();
    const params = useParams();
    const appData = useAppData()
    // matchRoutes([{path:''}],window.location.pathname)
    const match = {
      path: location.pathname,
      params
    }
    // console.log('appData', appData,location,navigate,params,match)
    const { clientRoutes } = appData
    return (
      <Component
        {...props}
        match={match}
        location={location}
        route={{ routes: clientRoutes }}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}

/** 获取bizCharts */
export function getBizCharts() {
  console.log('BizCharts', BizCharts, window.BizCharts)
  // externals兼容，import取不到的话，从window上取
  return BizCharts || window.BizCharts
}