import jwt from "jsonwebtoken";
import prisma from "../utils/db.js";
//  authenticate routes
export const authenticate = async (req, res, next) => {
    let token;
    console.log(req.cookies);
    // Read the JWT from the cookie
    token = req.cookies.jwt;
    console.log(token);

    if (token) {
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            const user = await prisma.user.findUnique({
              where: { id: decode.id },
            });
            console.log(user.role);
            
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(401).json({
                    message: "You are not authorized to access this route"
                })
            }
        } catch (error) {
            console.error(error);
            res.status(401).json({
                message: "Not authorized , token failed"
            });
        }
    } else {
        res.status(401).json({
            message: "Not authorized"
        });
    }
};