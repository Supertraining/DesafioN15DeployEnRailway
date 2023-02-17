import mongoose from 'mongoose'

const sessionCollection = 'sessions';
const sessionSchema = new mongoose.Schema({
	nombre: {type: String, require: true},
});

export const sessionmodel = mongoose.model(sessionCollection, sessionSchema);


