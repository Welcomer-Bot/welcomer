import { connect } from "mongoose"

const connectMongo = async () => {
    await connect(process.env.MONGO_URI!)
        .then(() => {
        console.log("Connected to MongoDB !")
        })
        .catch((err) => {
        console.error('An error occured while trying to connect to MongoDB database:', err)
    })
}


export {connectMongo}