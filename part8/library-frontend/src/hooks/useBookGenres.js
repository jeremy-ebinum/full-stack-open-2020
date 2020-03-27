import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import { GET_ALL_BOOKS } from "../graphql/queries";

const toGenres = (genres, book) => {
  const newGenres = book.genres.filter((g) => g && !genres.includes(g));
  return genres.concat(newGenres);
};

const useBookGenres = () => {
  const [books, setBooks] = useState([]);
  const [genresState, setGenresState] = useState({
    genres: [],
    hasGenres: false,
  });
  const getAllBooks = useQuery(GET_ALL_BOOKS);

  useEffect(() => {
    const { called, networkStatus, data } = getAllBooks;
    if (called && networkStatus > 6) {
      const newBooks = data ? data.allBooks : books;
      const genres = newBooks.reduce(toGenres, []);
      setGenresState({ genres, hasGenres: true });
      setBooks(newBooks);
    }
  }, [books, getAllBooks]);

  return genresState;
};

export default useBookGenres;
