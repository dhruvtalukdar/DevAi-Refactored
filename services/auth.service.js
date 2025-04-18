import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"; 
import { generateToken, hashPassword, createAccessToken, createRefreshToken } from "../lib/utils.js";

export const registerUser = async (email, password, fullName) => {
    try{
        // check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("User already exists");
        }

        // hash password
        const hashedPassword = await hashPassword(password);

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

export const loginUser = async (email, password) => {
    try {
        // check if user already exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw new Error("Invalid credentials");
        }

        // check password
        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        // generate token
        const accessToken = createAccessToken(existingUser._id);
        const refreshToken = createRefreshToken(existingUser._id);
        return { user: existingUser, accessToken, refreshToken };
    }
    catch (err) {
        throw err;
    }
}