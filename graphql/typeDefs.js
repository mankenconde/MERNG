const gql = require("graphql-tag");
//graphql type definitions
//adding "!" means it's required field
module.exports = gql`

    type Post{
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    },

    type User{
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    },

    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    },

    type Query{
        getPosts: [Post]
    },

    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password:String!) : User!
    }
`