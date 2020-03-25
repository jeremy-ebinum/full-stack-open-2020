import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import { GET_AUTH_USER } from "../queries";

const useAuthUser = () => {
  const [authStatus, setAuthStatus] = useState({
    user: null,
    hasSyncAuth: false,
  });
  const getAuthUser = useQuery(GET_AUTH_USER);

  const { networkStatus, data } = getAuthUser;

  useEffect(() => {
    if (networkStatus > 6) {
      const authUser = data ? data.me : null;
      setAuthStatus({ user: authUser, hasSyncAuth: true });
    } else {
      setAuthStatus({ user: null, hasSyncAuth: false });
    }
  }, [networkStatus, data]);

  return authStatus;
};

export default useAuthUser;
