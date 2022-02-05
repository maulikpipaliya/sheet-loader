import homeRouter from "./home.router.js"

export const setUpRoutes = (app) => {
    // app.use("/", commonRouter)
    app.use("/api", homeRouter)
}
