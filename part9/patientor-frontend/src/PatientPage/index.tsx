import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Icon, Card } from "semantic-ui-react";

import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, updatePatient } from "../state";
import { toPatient } from "../utils";
import { InvalidPatientError } from "../helpers/errorHelper";

import EntryDetails from "./EntryDetails";

const genderIcons = {
  male: "mars" as "mars",
  female: "venus" as "venus",
  other: "genderless" as "genderless",
};

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();
  const fetchStatus = useRef({ shouldFetch: false, hasFetched: false });

  let patient = patients[id];

  try {
    patient = toPatient({ ...patient });
  } catch (e) {
    if (e instanceof InvalidPatientError && !fetchStatus.current.hasFetched) {
      fetchStatus.current = { ...fetchStatus.current, shouldFetch: true };
    } else {
      console.error(e);
    }
  }

  useEffect(() => {
    const fetchPatient = async () => {
      fetchStatus.current = { ...fetchStatus.current, shouldFetch: false };
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatient(patientFromApi));
        fetchStatus.current = { ...fetchStatus.current, hasFetched: true };
      } catch (e) {
        console.error(e);
      }
    };

    if (fetchStatus.current.shouldFetch) {
      fetchPatient();
    }
  }, [id, dispatch]);

  if (!patient) return null;

  return (
    <Container>
      <h1>
        {patient.name} <Icon name={genderIcons[patient.gender]} />
      </h1>

      <p>
        <strong>SSN:</strong> {patient.ssn}
      </p>

      <p>
        <strong>Occupation:</strong> {patient.occupation}
      </p>

      {patient.entries.length > 0 && <h2>Entries</h2>}

      <Card.Group>
        {patient.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} />
        ))}
      </Card.Group>
    </Container>
  );
};

export default PatientPage;
