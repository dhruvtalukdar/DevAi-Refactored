import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"; 

export const registerUser = async (email, password, fullName) => {
    try{
        // check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("User already exists");
        }

        // hash password
        const hashedPassword = await hashPassword(password)

        // create user
        const createdUser = await User.create({
            email,
            password: hashedPassword,
            fullName
        });

        // generate token
        const refreshToken = createRefreshToken(createdUser._id);
        const accessToken = createAccessToken(createdUser._id);
        return { user: createdUser, accessToken, refreshToken }
    }
    catch (err) {
        throw err;
    }
}