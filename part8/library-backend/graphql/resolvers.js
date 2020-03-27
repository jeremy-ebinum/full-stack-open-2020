const _merge = require("lodash.merge");

const { resolvers: authorResolvers } = require("./schema/author");
const { resolvers: bookResolvers } = require("./schema/book");
const { resolvers: userResolvers } = require("./schema/user");

const resolvers = _merge({}, authorResolvers, bookResolvers, userResolvers);

module.exports = resolvers;
