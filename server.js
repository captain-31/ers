import app from "./app.js"
import { connectUsingMongoose } from "./src/config/mongodb.js"

const port = process.env.PORT
 
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
    connectUsingMongoose()
})