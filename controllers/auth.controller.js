


export const register = async (req, res) => {
    try {
        const { email, fullName, password } = req.body;
        const { user, accessToken, refreshToken } = await registerUser(email, password, fullName);

        // set cookies
        res
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                sameSite: "Strict",
                maxAge: 15 * 60 * 1000, // 15mins
                path: "/"
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "Strict",
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

