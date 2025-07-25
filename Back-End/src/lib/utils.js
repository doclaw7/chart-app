import JWT from "jsonwebtoken"


export const generateToken = (userId, res) => {

    const token = JWT.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"7d"

    })

    res.cookie("JWT", token, {
        maxAge: 7*24*60*60*1000, //This is the days in milli seconds
        httpOnly: true, //this prevents xxs attacks cross-site scripting attacks
        sameSite: "strict", //CSRF attacks crossiste request forgery attacks
        secure:process.env.NODE_ENV !=="development"
    });

    return token;
};