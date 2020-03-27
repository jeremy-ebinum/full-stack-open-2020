import { gql } from "@apollo/client";

// SERVER QUERIES
const BOOK_DETAILS = gql`
  fragment bookDetails on Book {
    title
    author {
      name
    }
    published
    genres
    id
  }
`;

export const GET_ALL_AUTHORS = gql`
  query getAllAuthors {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;

export const GET_ALL_BOOKS = gql`
  query getAllBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      ...bookDetails
    }
  }
  ${BOOK_DETAILS}
`;

export const GET_AUTH_USER = gql`
  query getAuthUser {
    me {
      username
      favoriteGenre
      id
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      ...bookDetails
    }
  }
  ${BOOK_DETAILS}
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      bookCount
      id
    }
  }
`;

export const ON_BOOK_ADDED = gql`
  subscription onBookAdded {
    bookAdded {
      ...bookDetails
    }
  }
  ${BOOK_DETAILS}
`;

// CLIENT QUERIES
export const ALL_NOTIFICATIONS = gql`
  query allNotifications {
    allNotifications @client
  }
`;

export const ADD_NOTIFICATION = gql`
  mutation addNotification($message: String!, $timeout: Int, $level: String) {
    addNotification(message: $message, timeout: $timeout, level: $level) @client
  }
`;

export const REMOVE_NOTIFICATION = gql`
  mutation removeNotification($id: ID!) {
    removeNotification(id: $id) @client
  }
`;
