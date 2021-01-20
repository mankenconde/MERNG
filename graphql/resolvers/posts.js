const Post = require('../../models/Post');

//these processes corresponding logic for the types above
module.exports = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await Post.find(); //gets all if nothing is specified
                return posts;
            } catch (error) {
                console.log("error getting posts", error);
                throw new Error(error);
            }
        }
    }
}