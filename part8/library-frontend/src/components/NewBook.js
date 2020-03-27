import React, { useRef, useState, useCallback } from "react";
import { useMutation, useSubscription } from "@apollo/client";
import { Redirect, useLocation } from "react-router-dom";
import { useUIDSeed, uid } from "react-uid";
import _debounce from "lodash.debounce";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import {
  CREATE_BOOK,
  GET_ALL_BOOKS,
  GET_ALL_AUTHORS,
  ON_BOOK_ADDED,
} from "../graphql/queries";
import { resolveApolloErrors } from "../helpers/errorHelper";
import useAuthUser from "../hooks/useAuthUser";
import useYupValidationResolver from "../hooks/useYupValidationResolver";
import useNotification from "../hooks/useNotification";
import LinkedNavBar from "./LinkedNavBar";
import Notifications from "./Notifications";

const validationSchema = yup.object().shape({
  title: yup.string().required(),
  author: yup.string().required(),
  published: yup
    .number()
    .typeError("enter a publication year as number")
    .integer()
    .required(),
  genre: yup.string(),
});

const NewBook = () => {
  const [genres, setGenres] = useState([]);
  const uidSeed = useUIDSeed();
  const { user, hasSyncAuth } = useAuthUser();
  const { pathname } = useLocation();
  const validationResolver = useYupValidationResolver(validationSchema);
  const notificationHelper = useNotification();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    errors,
    formState,
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      title: "",
      author: "",
      published: "",
      genre: "",
    },
    validationResolver,
  });

  const { touched, isSubmitting } = formState;

  const [createBook, createBookResults] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: GET_ALL_BOOKS }, { query: GET_ALL_AUTHORS }],
    onError: (error) => {
      const errorsToDisplay = resolveApolloErrors(error);
      notificationHelper.addMultiple(errorsToDisplay, "error", 5000);
    },
  });

  const isAddingBook = useRef(false);

  const notifyOnBookAdded = useCallback(
    _debounce(
      () => {
        console.log(isAddingBook.current);
        if (!isAddingBook.current) {
          notificationHelper.add("There are new books", "info");
        }
      },
      10000,
      { leading: true, trailing: false }
    ),
    [isAddingBook.current]
  );

  useSubscription(ON_BOOK_ADDED, {
    onSubscriptionData: () => {
      notifyOnBookAdded();
    },
  });

  const addGenre = useCallback(() => {
    const { genre } = getValues();
    if (genre) {
      setGenres((prevGenres) =>
        prevGenres.concat({ id: uid({}), value: genre })
      );
      setValue("genre", "");
    }
  }, [setValue, getValues]);

  const removeGenre = useCallback((id) => {
    setGenres((prevGenres) => prevGenres.filter((g) => g.id !== id));
  }, []);

  const handleGenreKeyPress = useCallback(
    (event) => {
      if (event.charCode === 13) {
        event.preventDefault();
        addGenre();
      }
    },
    [addGenre]
  );

  const addBook = useCallback(
    async (values) => {
      const { title, author, published } = values;
      const genreValues = genres.map((g) => g.value);

      isAddingBook.current = true;
      const gqlData = await createBook({
        variables: { title, author, published, genres: genreValues },
      });

      if (gqlData) {
        notificationHelper.add("Succesfully created Book", "success");
        setTimeout(() => {
          isAddingBook.current = false;
        }, 3000);
      } else {
        isAddingBook.current = false;
      }
      setGenres([]);
      reset();
    },
    [genres, createBook, reset, notificationHelper]
  );

  if (!hasSyncAuth) return null;

  if (hasSyncAuth && !user)
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: pathname },
        }}
      />
    );

  return (
    <>
      <Helmet>
        <title>GraphQL Library | Add New Book</title>
      </Helmet>
      <LinkedNavBar />
      <Notifications />
      <Container>
        <Form onSubmit={handleSubmit(addBook)} className="my-4">
          <h1 className="d-inline h2 mb-3 mr-2">Add a new Book</h1>
          {createBookResults.loading && (
            <Spinner variant="success" animation="grow" role="status" size="sm">
              <span className="sr-only">Creating Book...</span>
            </Spinner>
          )}
          <hr />

          <Form.Group as={Form.Row} controlId={uidSeed("title")}>
            <Form.Label column sm={2} md={1} className="font-weight-bold">
              Title
            </Form.Label>
            <Col sm={10} md={6}>
              <Form.Control
                ref={register}
                type="text"
                name="title"
                placeholder="Book Title"
                isValid={touched.title && !errors.title}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title && errors.title.message}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Form.Row} controlId={uidSeed("author")}>
            <Form.Label column sm={2} md={1} className="font-weight-bold">
              Author
            </Form.Label>
            <Col sm={10} md={6}>
              <Form.Control
                ref={register}
                type="text"
                name="author"
                placeholder="Book Author"
                isValid={touched.author && !errors.author}
                isInvalid={!!errors.author}
              />

              <Form.Control.Feedback type="invalid">
                {errors.author && errors.author.message}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Form.Row} controlId={uidSeed("published")}>
            <Form.Label column sm={2} md={1} className="font-weight-bold">
              Published
            </Form.Label>
            <Col sm={10} md={6}>
              <Form.Control
                ref={register}
                type="number"
                name="published"
                placeholder="Publication Year"
                isValid={touched.published && !errors.published}
                isInvalid={!!errors.published}
              />

              <Form.Control.Feedback type="invalid">
                {errors.published && errors.published.message}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Form.Row} controlId={uidSeed("genre")}>
            <Form.Label column sm={2} md={1} className="font-weight-bold">
              Genres
            </Form.Label>
            <Col sm={10} md={6}>
              <InputGroup>
                <Form.Control
                  ref={register}
                  onKeyPress={handleGenreKeyPress}
                  type="text"
                  name="genre"
                  placeholder="Book Genre"
                  aria-label="Add a Genre for the Book"
                  aria-describedby={uidSeed("genre")}
                />

                <InputGroup.Append>
                  <Button type="button" variant="primary" onClick={addGenre}>
                    Add
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                Enter a genre and click the button to add to the list of genres
              </Form.Text>

              <div>
                {genres.map((genre, index) => (
                  <div
                    key={genre.id}
                    className="d-inline-block border px-3 py-2 mr-2 mb-2"
                  >
                    <button
                      type="button"
                      className="close ml-3"
                      aria-label="Remove Genre"
                      onClick={() => removeGenre(genre.id)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <span>{genre.value}</span>
                  </div>
                ))}
              </div>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Col sm={{ offset: 2 }} md={{ offset: 1, span: 6 }}>
              <Button
                variant="success"
                type="submit"
                size="lg"
                block
                disabled={isSubmitting}
              >
                Create Book
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
};

export default NewBook;
