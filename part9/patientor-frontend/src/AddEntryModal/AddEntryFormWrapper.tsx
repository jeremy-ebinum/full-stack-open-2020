import React, { useState, useCallback } from "react";
import { Form, Dropdown, DropdownProps, Divider } from "semantic-ui-react";
import * as yup from "yup";

import { EntryType, NewEntry } from "../types";

import AddEntryForm from "./AddEntryForm";

const options = [
  {
    key: EntryType.HealthCheck,
    value: EntryType.HealthCheck,
    text: "Health Check",
  },
  {
    key: EntryType.OccupationalHealthCare,
    value: EntryType.OccupationalHealthCare,
    text: "Occupational Health Care",
  },
  { key: EntryType.Hospital, value: EntryType.Hospital, text: "Hospital" },
];

const baseSchema = yup.object().shape({
  description: yup.string().min(12).required(),
  date: yup
    .string()
    .matches(/\w{4}-\w{2}-\w{2}/, "Enter date in the format YYYY-MM-DD")
    .required(),
  specialist: yup.string().min(6).required(),
  diagnosisCodes: yup.array().of(yup.string()),
});

const healthCheckSchema = baseSchema.concat(
  yup.object().shape({
    healthCheckRating: yup
      .number()
      .typeError("health check rating must be a number")
      .min(0)
      .max(3)
      .required("Please enter a rating from 0(great) - 3(critical)"),
  })
);

const occupationalHealthCareSchema = baseSchema.concat(
  yup.object().shape({
    employerName: yup.string().min(3).required(),
    sickLeave: yup.object().shape({
      startDate: yup
        .string()
        .matches(/\w{4}-\w{2}-\w{2}/, "Enter date in the format YYYY-MM-DD"),
      endDate: yup
        .string()
        .matches(/\w{4}-\w{2}-\w{2}/, "Enter date in the format YYYY-MM-DD"),
    }),
  })
);

const hospitalSchema = baseSchema.concat(
  yup.object().shape({
    discharge: yup
      .object({
        date: yup
          .string()
          .matches(/\w{4}-\w{2}-\w{2}/, "Enter date in the format YYYY-MM-DD")
          .required("discharge date is a required field"),
        criteria: yup
          .string()
          .min(12)
          .required("discharge criteria is a required field"),
      })
      .required(),
  })
);

const baseInitialValues = {
  description: "",
  date: "",
  specialist: "",
};

const healthCheckInitialValues: NewEntry = {
  ...baseInitialValues,
  type: EntryType.HealthCheck,
  healthCheckRating: 0,
};

const occupationalHealthCareIntitialValues: NewEntry = {
  ...baseInitialValues,
  type: EntryType.OccupationalHealthCare,
  employerName: "",
  sickLeave: { startDate: "", endDate: "" },
};

const hospitalIntitialValues: NewEntry = {
  ...baseInitialValues,
  type: EntryType.Hospital,
  discharge: { date: "", criteria: "" },
};

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
}

const AddEntryFormWrapper: React.FC<Props> = ({ onCancel, onSubmit }) => {
  const [entryType, setEntryType] = useState<EntryType>(EntryType.HealthCheck);

  const handleChange = (
    _e: React.SyntheticEvent,
    { value }: DropdownProps
  ): void => {
    if (value) setEntryType(value as EntryType);
  };

  const entryForm = useCallback(() => {
    switch (entryType) {
      case EntryType.HealthCheck:
        return (
          <AddEntryForm
            initialValues={healthCheckInitialValues}
            validationSchema={healthCheckSchema}
            onCancel={onCancel}
            onSubmit={onSubmit}
          />
        );
      case EntryType.OccupationalHealthCare:
        return (
          <AddEntryForm
            initialValues={occupationalHealthCareIntitialValues}
            validationSchema={occupationalHealthCareSchema}
            onCancel={onCancel}
            onSubmit={onSubmit}
          />
        );
      case EntryType.Hospital:
        return (
          <AddEntryForm
            initialValues={hospitalIntitialValues}
            validationSchema={hospitalSchema}
            onCancel={onCancel}
            onSubmit={onSubmit}
          />
        );
      default:
        return null;
    }
  }, [entryType, onCancel, onSubmit]);

  return (
    <>
      <Form>
        <Form.Field>
          <label>Entry Type</label>
          <Dropdown
            fluid
            onChange={handleChange}
            options={options}
            selection
            value={entryType}
          />
        </Form.Field>
      </Form>

      <Divider />

      {entryForm()}
    </>
  );
};

export default AddEntryFormWrapper;
