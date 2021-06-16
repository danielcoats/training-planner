import { Card, Col, Container, Row } from 'react-bootstrap';
import { addNewPlanToDb } from '../features/plansSlice';
import { addWeekToDb } from '../features/weeksSlice';
import { useAppDispatch } from '../hooks';
import { formatDate } from '../utils/date-utils';
import {
  AddEditPlanInput,
  AddEditTrainingPlanForm,
} from './AddEditTrainingPlanForm';

export function EmptyState() {
  const dispatch = useAppDispatch();

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
        </Col>
      </Row>
    </Container>
  );
}
