import mongoose from "mongoose"

const URI = "mongodb+srv://mongoDBAtlas:CZK39urZQ0G2UOv9@mycluster.ovaat6g.mongodb.net/47310clase11?retryWrites=true&w=majority"

mongoose.connect(URI)
    .then (() => {
        console.log("Conectado a la bd.")
    })
    .catch ((error) => 
        console.log("Error: ", error))

