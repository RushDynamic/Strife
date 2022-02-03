import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const friendSchema = new Schema({
  username: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: 'accounts' }],
});

const Friend = new mongoose.model('friend', friendSchema);
export default Friend;
