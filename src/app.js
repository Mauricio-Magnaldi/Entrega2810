import express from 'express'
import usersRouter from "./router/users.router.js"
import "./db/dbConfig.js"
import mongoStore from "connect-mongo"
import session from "express-session"
import cookieParser from 'cookie-parser'
import passport from 'passport'
import "./passport.js"
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from "./router/views.router.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())

//handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine","handlebars")

//session
app.use(session({
    store: new mongoStore({
        mongoUrl: "mongodb+srv://mongoDBAtlas:CZK39urZQ0G2UOv9@mycluster.ovaat6g.mongodb.net/47310clase11?retryWrites=true&w=majority"
    }), 
    secret: 'SESSION_KEY',
    cookie: { maxAge: 60000 },
}))

// Passport
//Le indicamos que vamos a trabajar con passport para que así lo inicilice
app.use(passport.initialize())
//Le pedimos que lo que generemos lo guarde, enlace en, con sesiones para guardar la info del usuario
app.use(passport.session())

//router
app.use('/api/users', usersRouter)
app.use('/', viewsRouter)

const PORT = 8080

app.listen(PORT, ()=> {
    console.log(`Escuchando el puerto ${PORT}`)
})


