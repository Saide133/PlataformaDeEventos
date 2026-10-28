import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { registerService, loginService } from '../services/sessions.service.js';
import { UserRepository } from '../repositories/users.repository.js';

const userRepository = new UserRepository();


passport.use( 
    'register', 
    new LocalStrategy(
        { usernameField: 'email',passReqToCallback: true },
        async (req, email, password, done) => {
            try{
                const newUser = await registerService({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email,
                    password
                });

                return done(null, newUser);

            }catch(error){
                return done(null, false, { message: error.message });
            }
        }
    )
);

passport.use(
    'login',
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try{
                const logedUser = await loginService({ email, password });
                
                return done(null, logedUser);

            } catch (error){
                return done(null, false, { message: error.message });
            };
        }
    )
);

const cookieExtractor =(req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.currentUser;
    };
    return token;
};

passport.use(
    'current',
    new JwtStrategy(
        { jwtFromRequest: cookieExtractor, secretOrKey: process.env.JWT_SECRET },
        async (jwtPayload, done) => {
            try {
                const user = await userRepository.getUserById(jwtPayload.id);

                if (!user) {
                    return done(null, false);
                };

                return done(null, user);
                
            } catch (error) {
                return done(error);
            };
        }
    )
);