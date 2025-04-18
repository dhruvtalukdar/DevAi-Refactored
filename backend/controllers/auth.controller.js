import { registerUser, loginUser } from "../services/auth.service.js";


export const register = async (req, res) => {
    try {
        const { email, fullName, password } = req.body;
        const { user, accessToken, refreshToken } = await registerUser(email, password, fullName);

        // set cookies
        res
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                sameSite: "None",
                maxAge: 15 * 60 * 1000, // 15mins
                path: "/"
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "None",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: "/"       
            });

        res.status(201).json({ user });
        console.log("User registered succesfully");
    }
    catch (err) {
        console.error("Error registering user: ", err.message);
        if (!res.headersSent) {
            if (err.message === "User already exists") {
                return res.status(400).json({ message: err.message });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await loginUser(email, password);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            sameSite: "Lax", // or "Lax" depending on frontend
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
        });

        console.log("Cookie headers has been set");
        console.log("User logged in successfully");
        // res.json({ success: true, message: "Login successful!", redirectUrl: "/users/about", token: `${token}` });
        res.status(200).json({
            user, accessToken, refreshToken
        })
    }
    catch(err) {
        res.status(400).json(err);
        console.log("Error logging in user: ", err.message);
    }
}