import React from "react";
import { Modal, Segment } from "semantic-ui-react";
import { NewEntry } from "../types";

import AddEntryFormWrapper from "./AddEntryFormWrapper";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewEntry) => void;
  error?: string;
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`${error}`}</Segment>}
      <AddEntryFormWrapper onCancel={onClose} onSubmit={onSubmit} />
    </Modal.Content>
  </Modal>
);

export default AddEntryModal;
