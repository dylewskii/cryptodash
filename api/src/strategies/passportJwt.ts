import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { UserType } from "../models/User";
import dotenv from "dotenv";
dotenv.config();

const { JWT_ACCESS_SECRET } = process.env;

if (!JWT_ACCESS_SECRET) {
  throw new Error(
    "JWT_ACCESS_SECRET is not defined in the environment variables"
  );
}

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_ACCESS_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload: { id: string }, done: any) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: UserType) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};
