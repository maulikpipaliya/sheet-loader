import asyncHandler from "express-async-handler"
import HomeService from "../services/home.service.js"

export const homeController = asyncHandler(async (req, res) => {
    const response = await new HomeService().printHello()
    res.status(200).json(response)
})
