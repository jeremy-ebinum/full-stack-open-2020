import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Icon } from "semantic-ui-react";

import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { toPatient } from "../utils";
import { InvalidPatientError } from "../helpers/errorHelper";

const genderIcons = {
  male: "mars" as "mars",
  female: "venus" as "venus",
  other: "genderless" as "genderless",
};

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();
  const fetchStatus = useRef({ shouldFetch: false, hasFetched: false });

  let patient = { ...patients[id] };

  try {
    patient = toPatient(patient);
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
        dispatch({ type: "UPDATE_PATIENT", payload: patientFromApi });
        fetchStatus.current = { ...fetchStatus.current, hasFetched: true };
      } catch (e) {
        console.error(e);
      }
    };

    if (fetchStatus.current.shouldFetch) {
      fetchPatient();
    }
  }, [id, dispatch]);

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
    </Container>
  );
};

export default PatientPage;
