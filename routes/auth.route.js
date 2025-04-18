import express from "express";
import { register, login } from "../controllers/auth.controller.js"

const router = express.Router();

router.get('/random', (req, res) => {
    res.status(200).json({ message: "Success" })
})

router.post('/register', register);

router.post('/login', login);

// router.post('/logout', logoutUser);

// router.post('/update-profile', updateUser);

export default router;