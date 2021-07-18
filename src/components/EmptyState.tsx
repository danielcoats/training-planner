import { useRef } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { db } from '../db';
import { addNewPlanToDb } from '../features/plansSlice';
import { addWeekToDb } from '../features/weeksSlice';
import { useAppDispatch } from '../hooks';
import { formatDate } from '../utils/date-utils';
import {
  AddEditPlanInput,
  AddEditTrainingPlanForm,
} from './AddEditTrainingPlanForm';
import { importInto } from 'dexie-export-import';
import { initializeData } from '../features/appSlice';

export function EmptyState() {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitForm = async (values: AddEditPlanInput) => {
    const resultAction = await dispatch(
      addNewPlanToDb({
        name: values.name,
        eventDate: formatDate(values.eventDate),
      }),
    );
    if (addNewPlanToDb.fulfilled.match(resultAction)) {
      await dispatch(
        addWeekToDb({ planId: resultAction.payload.id, position: 1 }),
      );
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files !== null ? event.target.files[0] : null;
    if (file) {
      await importInto(db, file);
      dispatch(initializeData());
    }
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Card bg="light" border="light">
            <Card.Body>
              <Card.Text className="text-center">
                Create a training program for your next running event. Data is
                stored locally in your web browser.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center text-center">
        <Col md={6} lg={3}>
          <AddEditTrainingPlanForm
            editing={false}
            onSubmit={submitForm}
            size="lg"
          />
          <Button
            className="mt-2"
            variant="link"
            onClick={() => openFilePicker()}>
            Import from file
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            style={{ display: 'none' }}></input>
        </Col>
      </Row>
    </Container>
  );
}
