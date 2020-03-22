import React, { useCallback } from "react";
import { useMutation } from "@apollo/client";
import { useUIDSeed } from "react-uid";
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { CREATE_BOOK, GET_ALL_BOOKS, GET_ALL_AUTHORS } from "../queries";
import { handleApolloErrors } from "../helpers/errorHelper";
import useYupValidationResolver from "../hooks/useYupValidationResolver";
import useNotification from "../hooks/useNotification";
import LinkedNavBar from "./LinkedNavBar";
import Notifications from "./Notifications";

const validationSchema = yup.object().shape({
  title: yup.string().required(),
  author: yup.string().required(),
  published: yup
    .number()
    .typeError("published must be a number")
    .integer()
    .required(),
  genre: yup.string(),
  genres: yup
    .array()
    .of(yup.string())
    .ensure(),
});

const NewBook = () => {
  const uidSeed = useUIDSeed();
  const validationResolver = useYupValidationResolver(validationSchema);
  const notificationHelper = useNotification();
  const {
    control,
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
      genres: [],
    },
    validationResolver,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "genres",
  });

  const { touched, isSubmitting } = formState;

  const [createBook, createBookResults] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: GET_ALL_BOOKS }, { query: GET_ALL_AUTHORS }],
    onError: (error) => {
      handleApolloErrors(error);
      notificationHelper.add("Oops! Something Went Wrong", "error");
    },
  });

  const addGenre = useCallback(() => {
    const { genre } = getValues();
    if (genre) {
      append(genre);
      setValue("genre", "");
    }
  }, [setValue, getValues, append]);

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
    async (data, event) => {
      const { title, author, published, genres } = data;
      await createBook({ variables: { title, author, published, genres } });
      notificationHelper.add("Succesfully created Book", "success");
      reset();
    },
    [createBook, reset, notificationHelper]
  );

  return (
    <>
      <Helmet>
        <title>GraphQL Library | Add New Book</title>
      </Helmet>
      <LinkedNavBar />
      <Notifications />
      <Container>
        <Form onSubmit={handleSubmit(addBook)} className="mt-4">
          <div className="d-flex align-items-center">
            <h1 className="h2 mb-3 mr-2">Add a new Book</h1>
            {createBookResults.loading && (
              <Spinner variant="info" animation="grow" role="status" size="sm">
                <span className="sr-only">Creating Book...</span>
              </Spinner>
            )}
          </div>

          <Form.Group as={Form.Row} controlId={uidSeed("title")}>
            <Form.Label column sm={2} md={1}>
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
            <Form.Label column sm={2} md={1}>
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
            <Form.Label column sm={2} md={1}>
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
            <Form.Label column sm={2} md={1}>
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
                {fields.map((genre, index) => (
                  <div
                    key={genre.id}
                    className="d-inline-block border px-3 py-2 mr-2 mb-2"
                  >
                    <input
                      className="d-none"
                      ref={register}
                      name={`genres[${index}]`}
                    ></input>
                    <button
                      type="button"
                      className="close ml-3"
                      aria-label="Remove Genre"
                      onClick={() => remove(index)}
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
