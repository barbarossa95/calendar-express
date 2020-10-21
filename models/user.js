const { Schema, model } = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  userSchema = new Schema({
    name: {
      type: String,
      unique: true,
      index: true,
    },
    passwordHash: String,
  }),
  MODEL_NAME = 'User';

userSchema.methods = {
  safe: function () {
    const user = this.toObject();
    delete user.passwordHash;
    return user;
  },
};

userSchema.statics = {
  findByLogin: async function (username) {
    return await this.findOne({ name: username });
  },
  register: async function (username, password) {
    const userExists = await this.exists({ name: username });

    if (userExists) throw new Error('user already exists');

    const passwordHash = await bcrypt.hash(password, 5);

    return await this.create({
      name: username,
      passwordHash,
    });
  },
  createToken: async function (user) {
    const signOptions = {
      issuer: 'greshilov.v inc.', // Issuer
      subject: `user: @${user.name}`, // Subject
      audience: 'http://foo.bar', // Audience
      expiresIn: '24h',
    };
    const token = await jwt.sign(
      {
        user: {
          _id: user._id,
          name: user.name,
        },
      },
      process.env.EXPRESS_AUTH_SECRET,
      signOptions
    );

    return {
      token,
      user,
    };
  },
  checkCredentials: async function (username, password) {
    const user = await this.findOne({ name: username });

    if (!user) {
      throw new Error('user doesnt exists');
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) throw new Error('invalid credentials');

    return user;
  },
};

module.exports = model(MODEL_NAME, userSchema);
