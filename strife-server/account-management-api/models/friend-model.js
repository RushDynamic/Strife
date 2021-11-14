import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const friendSchema = new Schema({
    username: { type: String, required: true },
    friends: [{ username: String, avatar: String, publicKey: String }]
});

const Friend = new mongoose.model('friend', friendSchema);
export default Friend;