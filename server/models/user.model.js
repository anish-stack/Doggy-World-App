const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    Contact: {
        type: Number,
        required: [true, "Please Give Your Valid Contact Number"],
        trim: true,
        unique: true
    },
    Password: {
        type: String,
        required: [true, "Please Give Your Password"],
        trim: true
    },
    isContactNumberVerified: {
        type: Boolean,
        default: false
    },


    ContactNumberVerifiedOtp: {
        type: String
    },
    PasswordResetVerifiedOtp: {
        type: String
    },
    PasswordResetOtpExpiresAt:{
        type: String
    },
    ContactOtpExpiresAt: {
        type: String
    },
    role:{
        type:String,
        default:"User",
        enum:['User','Admin']
    }


}, { timestamps: true });

// Indexes
UserSchema.index({ Contact: 1 });

// Pre-save hook to hash the password before saving
UserSchema.pre('save', async function (next) {
    if (this.isModified('Password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.Password = await bcrypt.hash(this.Password, salt);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        return next();
    }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.Password);
};

// Export the User model
module.exports = mongoose.model('User', UserSchema);