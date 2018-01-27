import React from 'react'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import { NavBar } from 'antd-mobile'
import { Route } from 'react-router-dom'
import NavLinkBar from '../navlink/navlink' 
import Hr from '../../component/hr/hr'
import Genius from '../../component/genius/genius'
import User from '../../component/user/user'
import Msg from '../../component/msg/msg'
import { getMsgList, receMsg } from '../../redux/chat.redux'
import QueueAnim from 'rc-queue-anim'

@connect(
    state=>state,
    {getMsgList, receMsg}
)
class Dashboard extends React.Component{
    componentDidMount(){
        if(!this.props.chat.chatmsg.length){
            this.props.getMsgList()
            this.props.receMsg()
        }
    }
    render(){
        const {pathname} = this.props.location
        const user = this.props.user
        const navList = [
            {
                path: '/hr',
                text: '大神',
                icon: 'hr',
                title: '大神列表',
                component: Hr,
                hide: user.type==='genius'
            },
            {
                path: '/genius',
                text: 'hr',
                icon: 'job',
                title: 'hr列表',
                component: Genius,
                hide: user.type==='hr'
            },
            {
                path: '/msg',
                text: '消息',
                icon: 'msg',
                title: '消息列表',
                component: Msg
            },
            {
                path: '/me',
                text: '本尊',
                icon: 'user',
                title: '个人中心',
                component: User
            }
        ]

        const page= navList.find(v => v.path == pathname)

        return page ? (
            <div>
                <NavBar className='fixd-header' mode='dard'>{page.title}</NavBar>
                <div style={{marginTop:45}}>
                    <QueueAnim type='scaleX' duration={800}>    
                        <Route key={page.path} path={page.path} component={page.component}></Route>
                    </QueueAnim>
                </div>
                <NavLinkBar data={navList}></NavLinkBar>
            </div>
        ):<Redirect to='/msg'></Redirect>
    }
}

export default Dashboard