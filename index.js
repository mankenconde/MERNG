const { ApolloServer } = require('apollo-server');
const mongoose = require("mongoose"); //ORM library that let's use interface with Mongodb

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require("./config.js");

//don't have to do 'typeDefs:typeDefs' can actually do only 'typeDefs' because of how javascript works
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers
});

//connect to database
mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log("MONGODB Connected")
        //**Apolo servers use express in the backend */
        return server.listen({ port: 5000 });
    }).then(result => {
        console.log(`Server running at ${result.url}`);
    }).catch(error => {
        console.log("error starting server", error);
    });