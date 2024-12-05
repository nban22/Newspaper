import facebookPassport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";

import User from "../models/user";

facebookPassport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID!,
            clientSecret: process.env.FACEBOOK_APP_SECRET!,
            callbackURL: "/auth/facebook/callback",
            profileFields: ["id", "displayName", "photos", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ facebookId: profile.id });

                if (!user) {
                    // Nếu chưa có, tạo user mới
                    user = new User({
                        facebookId: profile.id,
                        name: profile.displayName,
                        email: profile.emails ? profile.emails[0].value : null, // Lấy email nếu có
                        role: "subscriber",
                    });
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);


facebookPassport.serializeUser((user: any, done) => {
    done(null, user.id);
})

facebookPassport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default facebookPassport;