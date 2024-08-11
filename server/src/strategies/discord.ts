import passport from 'passport';
import { Strategy as DiscordStrategy, Profile } from 'passport-discord';
import { User } from '../database/schemas';

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findOne({ id: id });
        return user ? done(null, user) : done(null, null);
    } catch (error) {
        return done(error, null);
    }
});


passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    callbackURL: process.env.DISCORD_REDIRECT_URI,
    scope: ['identify', 'guilds']
},
    async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
        try {
            const user = await User.findOneAndUpdate({ id: profile.id }, { accessToken, refreshToken }, { new: true });
            if (!user) {
                await User.create({ id: profile.id, accessToken, refreshToken });
            }
            return done(null, profile);
        } catch (error) {
            console.error(error);
            return done(error, null);
        }
    }
));