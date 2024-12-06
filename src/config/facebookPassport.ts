import facebookPassport from "passport";
import { Strategy as FacebookStrategy, Profile } from "passport-facebook";

import User from "../models/user";

if (!process.env.FACEBOOK_APP_ID) {
    throw new Error("FACEBOOK_APP_ID is not defined");
}
if (!process.env.FACEBOOK_APP_SECRET) {
    throw new Error("FACEBOOK_APP_SECRET is not defined");
}

facebookPassport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID!,
            clientSecret: process.env.FACEBOOK_APP_SECRET!,
            callbackURL: "/auth/facebook/callback",
            profileFields: ["id", "displayName", "photos", "email"],
        },
        async (accessToken, refreshToken, profile: Profile, done) => {
            
            let existingUser = await User.findOne({ facebookId: profile.id });

            if (existingUser) {
                return done(null, existingUser);
            }

            const newUser = await User.create({
                facebookId: profile.id,
                name: profile.displayName,
                email: profile.emails ? profile.emails[0].value : undefined,
                role: "subscriber",
                loginMethod: "facebook",
            });

            return done(null, newUser);
        }
    )
);

export default facebookPassport;
