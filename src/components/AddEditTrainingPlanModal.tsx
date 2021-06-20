import { Modal } from 'react-bootstrap';
import { selectedPlanIdUpdated } from '../features/appSlice';
import {
  addPlanWithWeekToDb,
  deleteAllPlanDataFromDb,
  Plan,
  updatePlanInDb,
} from '../features/plansSlice';
import { useAppDispatch } from '../hooks';
import { formatDate, isValidDateString } from '../utils/date-utils';
import {
  AddEditPlanInput,
  AddEditTrainingPlanForm,
} from './AddEditTrainingPlanForm';

interface AddEditTrainingPlanModalProps {
  show: boolean;
  onHide: () => void;
  plan?: Plan;
}

export function AddEditTrainingPlanModal({
  show,
  onHide,
  plan,
}: AddEditTrainingPlanModalProps) {
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: AddEditPlanInput) => {
    if (plan) {
      await dispatch(
        updatePlanInDb({
          id: plan.id,
          changes: {
            name: values.name,
            eventDate: formatDate(values.eventDate),
          },
        }),
      );
    } else {
      const result = await dispatch(
        addPlanWithWeekToDb({
          name: values.name,
          eventDate: formatDate(values.eventDate),
        }),
      );
      if (addPlanWithWeekToDb.fulfilled.match(result)) {
        dispatch(selectedPlanIdUpdated(result.payload.id));
      }
    }
    onHide();
  };

  const initialValues =
    plan !== undefined
      ? {
          name: plan.name,
          eventDate: isValidDateString(plan.eventDate)
            ? new Date(plan.eventDate)
            : null,
        }
      : undefined;

  const handleDelete = async () => {
    if (plan) {
      dispatch(deleteAllPlanDataFromDb(plan.id));
      onHide();
    }
  };

  return (
    <Modal show={show} size="sm" onHide={onHide}>
      <Modal.Body>
        <AddEditTrainingPlanForm
          editing={plan !== undefined}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          initialValues={initialValues}
        />
      </Modal.Body>
    </Modal>
  );
}
