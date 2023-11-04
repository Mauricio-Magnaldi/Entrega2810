import passport from "passport"
import { usersManager} from "./managers/usersManager.js"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as GithubStrategy } from "passport-github2"
import { hashData, compareData } from "./utils.js"

//Passport-local para definir nuestra estrategia local
passport.use("signup", 
    new LocalStrategy(
        {
            usernameField:'email',
            passReqToCallback: true,
        }, 
        async (request, email, password, done) => {
            try {
                const userDB = await usersManager.getByEmail(email)
                if(userDB) {
                    return done(null, false)
                }

                const hashedPassword = await hashData(password)
                const createdUser = await usersManager.createOne({...request.body, password:hashedPassword})
                done(null, createdUser)
            } catch (error) {
                done (error)
            }
        }
        )
)

passport.use('login', 
new LocalStrategy(
    {
        usernameField: "email",
    },
        async (email, password, done) => {
            try {
                const userDB = await usersManager.getByEmail(email)
                if (!userDB) {
                    return done(null, false)
                }
                const isValid = await compareData(password, userDB.password)
                if (!isValid) {
                    return done(null, false)
                }
                done(null, userDB)
            } catch (error) {
                done (error)
            }
        }
    )
)

//Passport por tercero, para definir la estrategia de github
//ClientID: lo tomo desde mi GitHub
//ClientSecret: le doy click a un boton en GitHub para generarlo
//CallbackURL: también lo tomo desde GitHub y fue definido por mi
passport.use(
    new GithubStrategy(
        {
            clientID: "Iv1.289d1cec6541ea0a",
            clientSecret: "022f9163046df8e01d9812c9f49722bfc1fb44bf",
            callbackURL: "http://localhost:8080/api/users/github",
    }, 
    async (accessToken, refreshToken, profile, done) => {
        console.log("Profile", profile)
        try {
            const userDB = await usersManager.getByEmail(profile.email)

            //login
            //Evalua si encuentra el usuario mediante un email en la bd
            if(userDB) {
                /*
                Evalua si el campo from_github es true, es decir, que el usuario
                se intenta loguear con su cuenta de github 
                */
                if(userDB.from_github) {
                    return done(null, userDB)
                } else {
                    return done(null, false)
                }
            }

            //signup
            const newUser = {
                first_name: "prueba",
                last_name: "otro",
                email: profile.email,
                password: "fdf",
                from_github: true
            }
            const createdUser = await usersManager.createOne(newUser)
            done(null, createdUser)

        } catch (error) {
            done(error);
        }
    }
    )
)

//Si se deben utilizar ambos métodos definidos en passport
//Tener la info completa del usuario y solo quedarse con el userId
passport.serializeUser(function(user, done) {
    done(null, user._id)
})
  
    //Tener el userId y a partir de ahí obtener la info completa del usuario
passport.deserializeUser(async function (id, done) {
    try {
        const user = await usersManager.getById(id)
        done(null, user)
    } catch (error) {
        done (error)
    }
})