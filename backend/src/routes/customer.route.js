import {Router} from "express"
import { registerCustomer, loginCustomer } from "../controllers/customer.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()
router.route("/register")
.post(upload.fields([
    {
        name:"avatar",
        maxCount: 1
    }
]), registerCustomer)

router.route("/login").post(loginCustomer)

export default router