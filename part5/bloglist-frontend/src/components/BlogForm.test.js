import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import testHelper from "../helpers/testHelper";
import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
  let createBlog;

  beforeEach(() => {
    createBlog = jest.fn().mockName("handleDelete");
  });

  afterEach(() => {
    cleanup();
  });

  test("correctly calls the handler prop on submit", () => {
    const { getByLabelText, getByRole } = render(
      <BlogForm createBlog={createBlog} />
    );

    const form = getByRole("form");
    const titleInput = getByLabelText(/title/i);
    const authorInput = getByLabelText(/author/i);
    const urlInput = getByLabelText(/url/i);

    fireEvent.change(titleInput, {
      target: { value: testHelper.validNewBlog.title },
    });
    fireEvent.change(authorInput, {
      target: { value: testHelper.validNewBlog.author },
    });
    fireEvent.change(urlInput, {
      target: { value: testHelper.validNewBlog.url },
    });

    fireEvent.submit(form);

    expect(createBlog).toHaveBeenCalledWith(testHelper.validNewBlog);
  });
});
