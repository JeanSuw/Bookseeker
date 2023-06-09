const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // returns a User type.
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select("-__v -password");
                return userData;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
  
    Mutation: {
        // Accepts an email and password as parameters; returns an Auth type.
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
    
            if (!user) {
            throw new AuthenticationError('No user found with this email address');
            }
    
            const correctPw = await user.isCorrectPassword(password);
    
            if (!correctPw) {
            throw new AuthenticationError('Incorrect credentials');
            }
    
            const token = signToken(user);
    
            return { token, user };
        },
        // Accepts a username, email, and password as parameters; returns an Auth type.
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        // Accepts a book author's array, description, title, bookId, image, and link as parameters; returns a User type.
        saveBook: async (parent, { input }, context) => {
            if (context.user) {
                const userUpdatedData = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: {saveBook: input} },

                );
                return userUpdatedData;
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        // Accepts a book's bookId as a parameter; returns a User type.
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
  };

module.exports = resolvers;