const { ApolloServer } = require("apollo-server");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const config = require("./utils/config");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { createBookCountLoader } = require("./graphql/loaders");

const User = require("./models/User");

const uri = config.MONGODB_URI;

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

console.log("connecting to", uri);

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const bookCountLoader = createBookCountLoader();

    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET);
      const authUser = await User.findById(decodedToken.id);
      return { bookCountLoader, authUser };
    }

    return { bookCountLoader };
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
