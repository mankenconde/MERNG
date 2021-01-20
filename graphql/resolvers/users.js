const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = {
    Mutation: {
        //parent gives you the result of what was the input of the last step, 
        //we don't need it here so we'll replace it with "_"
        //args = registerInputs (line 33) in typeDefs.js
        //context
        //info = just general information (metadata that we almost never need)

        async login(_, args, context, info) {
            let { username, password } = args;

            const { errors, valid } = validateLoginInput(username, password);

            const user = await User.findOne({ username });

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError("User not found", { errors });
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                errors.general = 'Wrong credentials';
                throw new UserInputError("Wrong credentials", { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user.id,
                token
            }
        },

        async register(_, args, context, info) {
            //destructuring args to get registerInput which is then destructured as well to get username, email etc...
            let { registerInput: { username, email, password, confirmPassword } } = args;

            //TODO: Validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            //TODO: make sure user doesn't already exist
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }
            //TODO: hash password before storing in database and create Auth token



            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const result = await newUser.save();

            const token = generateToken(result);

            return {
                ...result._doc,
                id: result.id,
                token
            }
        }
    }
}