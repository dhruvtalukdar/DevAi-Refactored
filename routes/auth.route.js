import express from "express";

const router = express.Router();


router.post('/signup', registerUser);

router.post('/login', loginUser);

router.post('/logout', logoutUser);

// router.post('/update-profile', updateUser);

export default router;