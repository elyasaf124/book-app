import mongoose from 'mongoose'
//מאפשר לגשת למידע ששמור בקובץ אנוו
import dotenv from 'dotenv'
dotenv.config({ path: './config.env' })

import { app } from './app.js'



const DB = process.env.DATABASE.replace('<PASSWORD_ATLES>', process.env.PASSWORD_ATLES)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    // console.log(con.connections)
    console.log('DB connaction successful')
})

const port = 3000
const server = app.listen(port, () => {
    console.log(`App running on port ${port}`)
})


// process.on('unhandledRejection', err => {
//     console.log('unhandledRejection shutting down...')
//     console.log(err.name, err.message)
//     server.close(() => {
//         process.exit(1)

//     })
// })

