import { Router } from "express"

import { homeController } from "../controllers/home.controller.js"

const router = Router({
    mergeParams: true,
})

router.get("/", homeController)

export default router
