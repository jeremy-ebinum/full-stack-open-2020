import React, { useState, useCallback, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { useUIDSeed } from "react-uid";
import { LOGIN, GET_AUTH_USER } from "../graphql/queries";
import { resolveApolloErrors } from "../helpers/errorHelper";
import useNotification from "../hooks/useNotification";

const LoginForm = () => {
  const [redirectPath, setRedirectPath] = useState("/");
  const { state } = useLocation();
  const history = useHistory();
  const notificationHelper = useNotification();

  useEffect(() => {
    if (state && state.from) {
      setRedirectPath(state.from);
    }
  }, [state]);

  const [login] = useMutation(LOGIN, {
    refetchQueries: ({ data: { login } }) => {
      const token = login.value;
      localStorage.setItem("fso20-gqlLibrary-user-token", token);
      return [{ query: GET_AUTH_USER }];
    },
    onError: (error) => {
      const errorsToDisplay = resolveApolloErrors(error);
      notificationHelper.addMultiple(errorsToDisplay, "error", 5000);
    },
    awaitRefetchQueries: true,
  });

  const uidSeed = useUIDSeed();
  const { register, errors, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { isSubmitting } = formState;

  const loginUser = useCallback(
    async (values) => {
      const variables = {
        username: values.username,
        password: values.password,
      };

      const gqlData = await login({ variables });
      reset();
      if (gqlData) {
        history.push(redirectPath);
        notificationHelper.add("Successfully logged in", "success");
      }
    },
    [login, notificationHelper, reset, redirectPath, history]
  );

  return (
    <Form onSubmit={handleSubmit(loginUser)}>
      <Form.Group as={Row} controlId={uidSeed("username")}>
        <Col>
          <Form.Control
            type="text"
            ref={register({
              required: "Please enter username: 'user_0'",
            })}
            name="username"
            placeholder="Enter Username"
            isInvalid={!!errors.username}
          />

          <Form.Control.Feedback type="invalid">
            {errors.username && errors.username.message}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId={uidSeed("password")}>
        <Col>
          <Form.Control
            type="text"
            ref={register({
              required: "Please enter password: 'password'",
            })}
            name="password"
            placeholder="Enter Password"
            isInvalid={!!errors.password}
          />

          <Form.Control.Feedback type="invalid">
            {errors.password && errors.password.message}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Col>
          <Button type="submit" size="lg" disabled={isSubmitting} block>
            <>
              {!isSubmitting && <span className="text-uppercase">Login</span>}
              {isSubmitting && (
                <Spinner animation="border" role="status">
                  <span className="sr-only">Logging in...</span>
                </Spinner>
              )}
            </>
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
};

export default LoginForm;
