import { useCallback } from "react";
import { useApolloClient } from "@apollo/client";

import { GET_ALL_BOOKS } from "../graphql/queries";
import logger from "../utils/logger";

const includedIn = (set, object) => set.map((p) => p.id).includes(object.id);

const useUpdateCache = () => {
  const client = useApolloClient();

  const handleEmptyQueryErrors = useCallback(
    async (query, data) => {
      try {
        await client.query({ query });
      } catch {
        await client.writeQuery({
          query,
          data,
        });
      }
    },
    [client]
  );

  const withBook = useCallback(
    async (addedBook) => {
      try {
        client.readQuery({ query: GET_ALL_BOOKS });
      } catch (e) {
        if (e.name === "Invariant Violation") {
          await handleEmptyQueryErrors(GET_ALL_BOOKS, { allBooks: [] });
        } else logger.error(e.message);
      }

      const dataInCache = client.readQuery({ query: GET_ALL_BOOKS });
      if (!includedIn(dataInCache.allBooks, addedBook)) {
        client.writeQuery({
          query: GET_ALL_BOOKS,
          data: { allBooks: dataInCache.allBooks.concat(addedBook) },
        });
      }
    },
    [client, handleEmptyQueryErrors]
  );

  return { withBook };
};

export default useUpdateCache;
