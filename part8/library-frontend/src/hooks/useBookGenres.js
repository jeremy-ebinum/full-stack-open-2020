import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import { GET_ALL_BOOKS } from "../queries";

const toGenres = (genres, book) => {
  const newGenres = book.genres.filter((g) => g && !genres.includes(g));
  return genres.concat(newGenres);
};

const useBookGenres = () => {
  const [genresState, setGenresState] = useState({
    genres: [],
    hasGenres: false,
  });
  const getAllBooks = useQuery(GET_ALL_BOOKS);

  const { networkStatus, data } = getAllBooks;

  useEffect(() => {
    if (networkStatus > 6) {
      const books = data ? data.allBooks : [];
      const genres = books.reduce(toGenres, []);
      setGenresState({ genres, hasGenres: true });
    } else {
      setGenresState({ genres: null, hasGenres: false });
    }
  }, [networkStatus, data]);

  return genresState;
};

export default useBookGenres;
