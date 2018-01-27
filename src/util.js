export function getRedirectPath({type, avatar}){
    //user.type /hr /gunius
    //user.avatar /hrinfo /geniusinfo
    let url = (type === 'hr')?'/hr':'/genius'
    if(!avatar){
        url += 'info'
    }
    return url
}

export function getChatId(userId, targetId){
    return [userId, targetId].sort().join('_')
}