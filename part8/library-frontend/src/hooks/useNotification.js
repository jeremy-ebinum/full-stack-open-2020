import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from "../queries";
import { handleApolloErrors } from "../helpers/errorHelper";

const useNotification = () => {
  const [addNotification] = useMutation(ADD_NOTIFICATION, {
    onError: (error) => handleApolloErrors(error),
  });

  const [removeNotification] = useMutation(REMOVE_NOTIFICATION, {
    onError: (error) => handleApolloErrors(error),
  });

  const add = useCallback(
    async (message, level = "", timeout = 3000) => {
      await addNotification({ variables: { message, timeout, level } });
    },
    [addNotification]
  );

  const remove = useCallback(
    async (id) => {
      await removeNotification({ variables: { id } });
    },
    [removeNotification]
  );

  return { add, remove };
};

export default useNotification;
