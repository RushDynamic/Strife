import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const authSchema = new Schema({
  username: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

export const AuthToken = new mongoose.model('authtokens', authSchema);
