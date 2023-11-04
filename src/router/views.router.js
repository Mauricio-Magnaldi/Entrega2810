import { Router } from 'express'

const router = Router()

router.get('/login', (request, response) => {
    response.render("login")
})

router.get('/signup', (request, response) => {
    response.render("signup")
})

router.get('/home', (request, response) => {
    console.log(request)
    response.render("home", { first_name: request.user.first_name })
})

router.get('/error', (request, response) => {
    response.render("error")
})

export default router
