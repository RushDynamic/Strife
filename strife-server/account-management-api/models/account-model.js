import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    publicKey: { type: String, required: true },
    privateKeyAccessStr: { type: String, required: true },
    avatar: { type: String, required: false, default: "http://localhost:3001/images/default_avatar.jpg" }
},
    {
        timestamps: true
    });

const Account = new mongoose.model('accounts', accountSchema);
export default Account;