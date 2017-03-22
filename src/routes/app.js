import React, { PropTypes } from 'react'
import { connect } from 'dva'
import Login from './login'
import { browserHistory } from 'dva/router'
import { Layout } from '../components'
import { Spin } from 'antd'
import { classnames } from '../utils'
import '../components/skin.less'
const { Header, Bread, Footer, Sider, styles } = Layout

function App({ children, location, dispatch, app, loading }) {
    console.log(location)
    console.log(browserHistory)
    const { login, loginButtonLoading, user, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys } = app
    const loginProps = {
        loading,
        loginButtonLoading,
        onOk(data) {
            dispatch({ type: 'app/login', payload: data })
        },
    }
    const headerProps = {
        user,
        siderFold,
        location,
        isNavbar,
        menuPopoverVisible,
        navOpenKeys,
        switchMenuPopover() {
            dispatch({ type: 'app/switchMenuPopver' })
        },
        logout() {
            dispatch({ type: 'app/logout' })
            browserHistory.push('/') //退出后地址栏应该显示首页地址 
        },
        switchSider() {
            dispatch({ type: 'app/switchSider' })
        },
        changeOpenKeys(openKeys) {
            localStorage.setItem('navOpenKeys', JSON.stringify(openKeys))
            dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
        },
    }
    const siderProps = {
        siderFold,
        darkTheme,
        location,
        navOpenKeys,
        changeTheme() {
            dispatch({ type: 'app/changeTheme' })
        },
        changeOpenKeys(openKeys) {
            localStorage.setItem('navOpenKeys', JSON.stringify(openKeys))
            dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
        },
    }
    // if (!login && location.pathname !== '/') {
    //     browserHistory.push('/')
    // }
     //使用该方法，如果直接输入路径访问，登录后会定向到首页，一般登录后进入输入的地址
    
    return (<div>{login
        ? <div className={classnames(styles.layout, { [styles.fold]: isNavbar ? false : siderFold }, { [styles.withnavbar]: isNavbar })}>
          {!isNavbar ? <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
            <Sider {...siderProps} />
          </aside> : ''}
          <div className={styles.main}>
            <Header {...headerProps} />
            <Bread location={location} />
            <div className={styles.container}>
              <div className={styles.content}>
                {children}
              </div>
            </div>
            <Footer />
          </div>
        </div>
        : <div className={styles.spin}><Spin tip="加载用户信息..." spinning={loading} size="large"><Login {...loginProps} /></Spin></div>}</div>)
}
App.propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    app: PropTypes.object,
    loading: PropTypes.bool,
}
function mapStateToProps(state){
 
    return {...state, loading: state.loading.models.app}
}
export default connect(mapStateToProps)(App)
