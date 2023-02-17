import userContainer from '../api/mongoDbUsersContainer.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const usersContainer = new userContainer();

function serialDeserial(){
passport.serializeUser((user, done) => {
	done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
	let usuario = await usersContainer.getUser(username);
	done(null, usuario);
});

}

function passportRegister(req, res, next) {
	passport.use(
		'register',
		new LocalStrategy(
			{
				passReqToCallback: true,
			},
			async (req, username, password, done) => {
				let usuario = await usersContainer.getUser(username);
				if (usuario) {
					return done('el usuario ya esta registrado');
				}
				let newUser = await usersContainer.insertUser({ username, password });

				done(null, newUser);
			}
		)
	);
	next();
}
function passportLogin(req, res, next) {
	passport.use(
		'login',
		new LocalStrategy(async (username, password, done) => {
			let usuario = await usersContainer.getUser(username);

			let auth = await usersContainer.authHash(username, password);

			if (!usuario) {
				return done(null, false);
			}
			if (!auth) {
				return done(null, false);
			}

			return done(null, usuario);
		})
	);
	next();
}

export { passportRegister, passportLogin, serialDeserial };
