import React from 'react'
import { connect } from 'react-redux'
import { getUserList } from '../../redux/chatuser.redux'
import UserCard from '../usercard/usercard'

@connect(
    state => state.chatuser,
    {getUserList}
)
class Genius extends React.Component{
    componentDidMount(){
        // axios.get('/user/list?type=genius')
        //     .then(res => {
        //         if(res.data.code === 0){
        //             this.setState({data:res.data.data})
        //         }
        //     })
        this.props.getUserList('hr')
    }
    render(){
        //const Header = Card.Geader
        //const body = Card.Body
        return (
            <UserCard userlist={this.props.userlist}></UserCard>
        )
    }
}

export default Genius