import { setUpExpressServer } from "./config/index.js"
import { setUpRoutes } from "./api/routes/index.js"
import { errorHandler, notFound } from "./api/middlewares/error.middleware.js"

const app = setUpExpressServer()

setUpRoutes(app)

app.use(notFound)
app.use(errorHandler)
