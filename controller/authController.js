const passport = require("../middleware/passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

function createToken(user) {
    const token = jwt.sign({ userPass: user.userPass }, process.env.SECRET_KEY, {
        expiresIn: "1h",
    });
    return token;
}

module.exports = {
    async register(req, res) {
        const {
            firstName,
            lastName,
            gender,
            userDOB,
            emailAdd,
            userPass,
            userRole,
        } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(userPass, 10)

            const user = {
              firstName,
              lastName,
              gender,
              userDOB,
              emailAdd,
              userPass: hashedPassword,
              userRole,
            };

            await User.createUser(user)

            const token = createToken(user)

            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: 360000
            })

            res.json({
                status: res.statusCode,
                msg: 'User has been registered'
            })
        } catch (error) {
            console.log(error);
            res
              .status(500)
              .json({ error: "An error occurred while registering the user" });
        }
    },

    async login(req, res, next){
        passport.authenticate('local', (err, user, info) =>{
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(400).json({message: info.message})
            }
            req.logIn(user, (loginErr) =>{
                if(loginErr){
                    return next(loginErr)
                }
                return res.json({message: 'Login successful'})
            })
        })(req, res, next)
    },

    async logout(req, res){
        req.logout()
        res.json({message: 'Logged out successfully'})
    }
};
