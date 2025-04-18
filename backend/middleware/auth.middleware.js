import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ meessage: "Unauthorized - No Token Provided" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Recieved Token: ", token);

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized - Token Expired" });
            }
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });

        }
        const decodedUser = await User.findById(decodedToken.id).select("-password");

        if(!decodedUser) {
            return res.status(404).json({ message: "User not found!"});
        };

        req.user = decodedUser;

        next();
    }
    catch(error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}