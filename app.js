import './env.js'

import express from 'express'
import path from 'path'
import ejsLayouts from 'express-ejs-layouts'
import cookieParser from 'cookie-parser'

import userRouter from './src/features/user/routes/user.routes.js'
import reviewRouter from './src/features/review/routes/review.routes.js'

const app = express()

app.use(cookieParser())

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))
app.use(express.static('src/views'))

app.set('view engine', 'ejs')
app.set('views', path.join(path.resolve(), 'src', 'views'))

app.use(ejsLayouts)

// router - update this 
app.use('/', userRouter)
app.use('/', reviewRouter)

// 404 route
app.use((req, res) => {
    res.status(404).render('404')
});

export default app