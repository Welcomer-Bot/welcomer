import cors from 'cors';
import express, { Express } from 'express';
import session from 'express-session';
import passport from 'passport';
import routes from '../routes';
import MongoStore from 'connect-mongo';

require("../strategies/discord");


export function createApp(): Express {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use(cors({
        origin: [process.env.CLIENT_URL as string, 'http://localhost:3005'],
        credentials: true
    }));

    app.use(session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none'
        },
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI as string })
    }));

    app.use(passport.initialize());
    app.use(passport.session());


    app.use("/api/v1", routes);
    return app;

}