import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import cookieParser from 'cookie-parser'
import model from './model'
import csshook from 'css-modules-require-hook/preset'
import assethook from 'asset-require-hook'
assethook({
    extensions: ['png']
})

import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { StaticRouter} from 'react-router-dom'
import App from '../src/app.js'
import reducers from '../src/reducer'
import { renderToString, renderToNodeStream } from 'react-dom/server'
import staticPath from '../build/asset-manifest.json'
//console.log(staticPath)

const Chat = model.getModel('chat')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', function(socket){
    //console.log('user login')
    socket.on('sendmsg', function(data){
        //console.log(data)
        const {from, to, msg} = data
        const chatid = [from, to].sort().join('_')
        Chat.create({chatid, from, to, content: msg}, function(err, doc){
            io.emit('recemsg', Object.assign({}, doc._doc))
        })
        //console.log(data)
        //io.emit('recemsg', data)
    })
    
})

const userRouter = require('./user')

app.use(cookieParser())
app.use(bodyParser.json())
app.use('/user', userRouter)
app.use(function(req, res, next){
    if(req.url.startsWith('/user/') || req.url.startsWith('/static/')){
        return next()
    }
    const store = createStore(reducers, compose(
        applyMiddleware(thunk),
    ))
    let context = {}
    // const markup = renderToString(
    //     (<Provider store={store}>
    //         <StaticRouter location={req.url} context={context}>
    //             <App></App>
    //         </StaticRouter>
    //     </Provider>)
    // )
    const obj = {
        '/msg': '聊天信息列表',
        '/hr': '大神信息列表页'
    }
    res.write(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        <meta name="keywords" content="React, Redux, ChatApp">
        <meta name="description" content="${obj[req.url]}">
        <link rel="stylesheet" href="/${staticPath['main.css']}">
        <title>React App</title>
      </head>
      <body>
        <noscript>
          You need to enable JavaScript to run this app.
        </noscript>
        <div id="root">`)
    
    const markupStream = renderToNodeStream(
        (<Provider store={store}>
            <StaticRouter location={req.url} context={context}>
                <App></App>
            </StaticRouter>
        </Provider>)
    )
    
    markupStream.pipe(res, {end: false})
    markupStream.on('end', () => {
        res.write(`</div>
        <script type="text/javascript" src="/${staticPath['main.js']}"></script>  
      </body>
    </html>`)
        res.end()
    })

    // const pageHtml = `<!DOCTYPE html>
    // <html lang="en">
    //   <head>
    //     <meta charset="utf-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    //     <meta name="theme-color" content="#000000">
    //     <meta name="keywords" content="React, Redux, ChatApp">
    //     <meta name="description" content="${obj[req.url]}">
    //     <link rel="stylesheet" href="/${staticPath['main.css']}">
    //     <title>React App</title>
    //   </head>
    //   <body>
    //     <noscript>
    //       You need to enable JavaScript to run this app.
    //     </noscript>
    //     <div id="root">${markup}</div>
    //     <script type="text/javascript" src="/${staticPath['main.js']}"></script>  
    //   </body>
    // </html>
    // `

    //console.log('path resolve', path.resolve('build/index.html'))
    //return res.sendFile(path.resolve('build/index.html'))
    // const htmlRes = (<App></App>)
    //res.send(pageHtml)
})
app.use('/', express.static(path.resolve('build')))

server.listen(8000, function(){
    console.log('the server running at port 8000')
})