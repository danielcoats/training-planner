import { useState } from 'react';
import { Card, OverlayTrigger } from 'react-bootstrap';
import { OverlayInjectedProps } from 'react-bootstrap/esm/Overlay';
import { useDrag } from 'react-dnd';
import {
  addWorkoutToDb,
  deleteWorkoutFromDb,
  updateWorkoutInDb,
  Workout,
} from '../features/workoutsSlice';
import { useAppDispatch } from '../hooks';
import {
  AddEditWorkoutInput,
  AddEditWorkoutPopover,
} from './AddEditWorkoutPopover';
import styles from './workoutCard.module.scss';

interface WorkoutCardProps {
  workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const dispatch = useAppDispatch();
  const [showPopover, setPopoverVisibility] = useState(false);

  const [, drag] = useDrag(() => ({
    type: 'workout',
    item: { id: workout.id },
  }));

  const handleSubmit = async ({ type, description }: AddEditWorkoutInput) => {
    await dispatch(
      updateWorkoutInDb({
        id: workout.id,
        changes: {
          type,
          description,
        },
      }),
    );
    setPopoverVisibility(false);
  };

  const handleDelete = async () => {
    await dispatch(
      deleteWorkoutFromDb({
        id: workout.id,
      }),
    );
  };

  const handleCopy = async () => {
    await dispatch(addWorkoutToDb(workout));
  };

  const renderPopover = (props: OverlayInjectedProps) => (
    <AddEditWorkoutPopover
      id="editWorkoutPopover"
      editing={true}
      onSubmit={handleSubmit}
      initialValues={workout}
      props={props}
      onDelete={handleDelete}
      onCopy={handleCopy}
    />
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="top"
      show={showPopover}
      onToggle={(nextShow) => setPopoverVisibility(nextShow)}
      overlay={renderPopover}
      rootClose={true}>
      <Card className={styles.workoutCard} ref={drag}>
        {/* TODO: implement checkbox */}
        {/* <div className={styles.checkbox}></div> */}
        <Card.Body className="text-center">
          <Card.Text className="mb-0">{workout.type}</Card.Text>
          <Card.Text className="text-muted small">
            {workout.description}
          </Card.Text>
        </Card.Body>
      </Card>
    </OverlayTrigger>
  );
}
