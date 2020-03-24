import React, { useCallback } from "react";
import { useMutation } from "@apollo/client";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { useUIDSeed } from "react-uid";
import { GET_ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { resolveApolloErrors } from "../helpers/errorHelper";
import useNotification from "../hooks/useNotification";

const AuthorsForm = ({ authors }) => {
  const selectOptions = authors.map((a) => ({ value: a.id, label: a.name }));

  const [editAuthor, editAuthorResults] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: GET_ALL_AUTHORS }],
    onError: (error) => {
      const errorsToDisplay = resolveApolloErrors(error);
      notificationHelper.addMultiple(errorsToDisplay, "error", 5000);
    },
  });

  const notificationHelper = useNotification();
  const uidSeed = useUIDSeed();
  const { register, errors, handleSubmit, control, formState, reset } = useForm(
    {
      defaultValues: {
        author: "",
      },
    }
  );

  const { isSubmitting } = formState;

  const updateAuthor = useCallback(
    async (values) => {
      const variables = {
        name: values.author.label,
        setBornTo: parseInt(values.birthYear),
      };

      const gqlData = await editAuthor({ variables });
      if (gqlData) {
        notificationHelper.add("Author edited succesfully", "info");
      }
      reset();
    },
    [editAuthor, notificationHelper, reset]
  );

  return (
    <Form onSubmit={handleSubmit(updateAuthor)}>
      <div className="d-flex align-items-baseline">
        <h2 className="h4 mb-3 mr-2">Update Author</h2>
        {editAuthorResults.loading && (
          <Spinner variant="info" animation="grow" role="status" size="sm">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
      </div>

      <Form.Group as={Form.Row}>
        <Form.Label htmlFor={uidSeed("author")} srOnly>
          Author
        </Form.Label>
        <Col xs={10} md={5}>
          <Controller
            name="author"
            as={Select}
            control={control}
            rules={{ required: true }}
            options={selectOptions}
            aria-label={uidSeed("author")}
            aria-labelledby={uidSeed("author")}
          />

          <small className="text-danger">
            {errors.author && "Please select an author"}
          </small>
        </Col>
      </Form.Group>

      <Form.Group as={Form.Row} controlId={uidSeed("birthYear")}>
        <Col xs={8} md={4}>
          <Form.Control
            type="number"
            ref={register({
              required: "birth year is a required field",
            })}
            name="birthYear"
            placeholder="Enter Birth Year"
            isInvalid={!!errors.birthYear}
          />

          <Form.Control.Feedback type="invalid">
            {errors.birthYear && errors.birthYear.message}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Col>
          <Button type="submit" disabled={isSubmitting}>
            Update
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
};

export default AuthorsForm;
