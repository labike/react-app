import React from 'react'
import { List, Radio, InputItem, WhiteSpace, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import Logo from '../../component/logo/logo'
import { Redirect } from 'react-router-dom'
import { regisger } from '../../redux/user.redux'
import heightForm from '../../component/height-form/height-form'

@connect(
    state => state.user,
    {regisger}
)
@heightForm
class Register extends React.Component{
    constructor(props){
        super(props)
        // this.state = {
        //     user: '',
        //     pwd: '',
        //     repeatpwd: '',
        //     type: 'genius'
        // }
        this.handleRegister = this.handleRegister.bind(this)
    }
    // handleChange(key, val){
    //     this.setState({
    //         [key]: val
    //     })
    // }
    componentDidMount(){
        this.props.handleChange('type', 'genius')
    }
    handleRegister(){
        this.props.regisger(this.props.state)
    }
    render(){
        const RadioItem = Radio.RadioItem
        return(
            <div>
                {this.props.redirectTo?<Redirect to={this.props.redirectTo} />:null}
                <Logo></Logo>
                <List>
                    {this.props.msg?<p className='error-msg'>{this.props.msg}</p>:null}
                    <InputItem onChange={v => this.props.handleChange('user', v)}>用户名</InputItem>
                    <WhiteSpace />
                    <InputItem onChange={v => this.props.handleChange('pwd', v)} type='password'>密码</InputItem>
                    <WhiteSpace />
                    <InputItem onChange={v => this.props.handleChange('repeatpwd', v)} type='password'>确认密码</InputItem>
                    <WhiteSpace />
                    <RadioItem 
                        checked={this.props.state.type==='genius'} 
                        onChange={() => this.props.handleChange('type', 'genius')}
                    >
                        大神
                    </RadioItem>
                    <RadioItem 
                        checked={this.props.state.type==='hr'}
                        onChange={() => this.props.handleChange('type', 'hr')}
                    >
                        HR
                    </RadioItem>
                    <WhiteSpace />
                    <Button type='primary' onClick={this.handleRegister}>注册</Button>
                </List>
            </div>
        )
    }
}

export default Register