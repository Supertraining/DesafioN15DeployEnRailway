import express from 'express';
import userContainer from '../api/mongoDbUsersContainer.js';
import passport from 'passport';
import { passportLogin, passportRegister, serialDeserial } from '../passport/passport.js';

const usersContainer = new userContainer();

serialDeserial();

const userRouter = express.Router();

userRouter.get('/register', (req, res) => {
	res.render('register');
});

userRouter.post(
	'/register',
	passportRegister,
	passport.authenticate('register', { failureRedirect: '/failregister', successRedirect: '/' })
);

userRouter.get('/failregister', (req, res) => {
	res.render('register-error', { error: req });
});

userRouter.get('/login', (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/inicio');
	}
	res.render('login');
});

userRouter.post(
	'/login',
	passportLogin,
	passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/inicio' })
);

userRouter.get('/faillogin', (req, res) => {
	res.render('login-error');
});

function requireAuthentication(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/login');
	}
}
userRouter.get('/inicio', requireAuthentication, async (req, res) => {
	let usuario = await usersContainer.getUser(req.user.username);

	res.render('inicio', {
		userName: usuario.username,
	});
});

userRouter.get('/logout', (req, res) => {
	res.render('endSession', { userName: req.user.username });
	setTimeout(() => {
		req.logout((err) => {
			if (err) {
				console.log('Error en cierre de sesión');
			} else {
				console.log('session eliminada con éxito');
			}
		});
	}, 2000);
});

userRouter.get('/', (req, res) => {
	res.redirect('/inicio');
});

export default userRouter;
