import React from "react";
import { Card, Icon, List } from "semantic-ui-react";

import { OccupationalHealthCareEntry as OccupationalHealthCare } from "../types";

import DiagnosisList from "./DiagnosisList";

const OccupationalHealthCareEntry: React.FC<{
  entry: OccupationalHealthCare;
}> = ({ entry }) => {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          {entry.date} <Icon color="purple" name="cog" />
        </Card.Header>
        <Card.Meta>by {entry.specialist}</Card.Meta>
        <Card.Description>{entry.description}</Card.Description>
        {entry.diagnosisCodes && (
          <DiagnosisList diagnosesCodes={entry.diagnosisCodes} />
        )}

        <List>
          <List.Item>
            <strong>Employer:</strong> {entry.employerName}
          </List.Item>
          {entry.sickLeave && (
            <List.Item>
              <strong>Sick Leave:</strong> {entry.sickLeave.startDate} to{" "}
              {entry.sickLeave.endDate}
            </List.Item>
          )}
        </List>
      </Card.Content>
    </Card>
  );
};

export default OccupationalHealthCareEntry;
