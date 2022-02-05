import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { envConfig } from "./globals.js"

import bodyParser from "body-parser"

export const setUpExpressServer = () => {
    const app = express()

    dotenv.config()

    //   app.use(cors({ origin: envConfig.corsOrigin }));

    //Middleware

    app.use(express.json())

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.listen(envConfig.port, () => {
        console.log(`server started at ${envConfig.port}`)
    })

    if (process.env.NODE_ENV === "production") {
        const __dirname = path.resolve()
        // console.log("__dirname")
        // console.log(__dirname)
        app.use(express.static(path.join(__dirname, "/client/build")))

        app.get("*", (req, res) =>
            res.sendFile(
                path.resolve(__dirname, "client", "build", "index.html")
            )
        )
    } else {
        app.get("/", (req, res) => {
            res.redirect("/api")
        })
    }

    return app
}
