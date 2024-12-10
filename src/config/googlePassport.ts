import googlePassport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user";
import { Profile } from "passport-google-oauth20";

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not defined");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not defined");
}

googlePassport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: "http://localhost:3002/auth/google/callback",
        },
        async (accessToken, refreshToken, profile: Profile, done) => {
            const existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) {
                return done(null, existingUser);
            }

            const user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails ? profile.emails[0].value : null,
                role: "subscriber",
                loginMethod: "google",
            });

            return done(null, user);
        }
    )
);

export default googlePassport;
