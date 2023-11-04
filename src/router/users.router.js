import { Router } from "express"
import { usersManager } from "../managers/usersManager.js"
import { hashData, compareData } from "../utils.js"
import passport from "passport"

const router = Router()

//En este endpoint se puede agregar la validación inicial de que si el usuario ya existe o no, antes de
// router.post('/',async(request,response) => {
//     const { password } = request.body
//     try {
//         const hashedPassword = await hashData(password)
//         const createdUser = await usersManager.createOne({...request.body, password:hashedPassword})
//         response.status(200).json({mensaje: "Usuario creado",user: createdUser})
//     } catch (error) {
//         response.status(500).json({error})
//     }
// })

// router.post('/login', async (request, response) => {
//     const { email, password } = request.body
//     try {
//         const userDB = await usersManager.getByEmail(email)
//         if (!userDB) {
//             return response.status(401).json({mensaje: "El email o el password no existen."})
//         }
//         const isValid = await compareData(password, userDB.password)
//         if (!isValid) {
//             return response.status(401).json({mensaje: "El email o el password no existen."})
//         }
//         response.status(200).json({mensaje: `Bienvenido ${userDB.first_name}`})
//     } catch (error) {
//         response.status(500).json({error})
//     }
// })

//Signup y login con passport
//Le paso la estrategia signup ya definida que quiero que use
/*
Passport permite redireccionar a un slash u otro dependiendo del resultado de la acción y de esta forma evitamos el (request, response)
*/
router.post("/signup", passport.authenticate("signup", {
    successRedirect: "/home",
    failureRedirect: "/error",    
    }
))

router.post("/login", passport.authenticate("login", {
    successRedirect: "/home",
    failureRedirect: "/error",
    }
))

//Login con passport con Github
router.get("/auth/github",
    passport.authenticate("github", { scope: [ "user:email" ] })
)

router.get("/github",
    passport.authenticate("github", {
        failureRedirect: '/error',
    }),
        (req, res) => {
            req.session.user = req.user;
            res.redirect("/home")
        }  
    )

    router.get("/:userId", async(request, response) => {
        const { userId } = request.params
        try {
            const user = await usersManager.getById(userId)
            response.status(200).json({mensaje: "Usuario encontrado",user})
        } catch (error) {
            response.status(500).json({error})
        }
    })    

export default router