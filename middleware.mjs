import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Not authorized" });
    }
    // if token exists
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            res.status(401).json({ success: false, message: "token invalid" });
        }

        req.user = user;
        next();
    });
};
