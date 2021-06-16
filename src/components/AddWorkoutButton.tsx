import { useState } from 'react';
import { Button, OverlayTrigger } from 'react-bootstrap';
import { OverlayInjectedProps } from 'react-bootstrap/esm/Overlay';
import { WeekDay } from '../features/types';
import { addWorkoutToDb } from '../features/workoutsSlice';
import { useAppDispatch } from '../hooks';
import {
  AddEditWorkoutInput,
  AddEditWorkoutPopover,
} from './AddEditWorkoutPopover';
import styles from './addWorkoutButton.module.scss';
import { default as cn } from 'classnames';

interface AddWorkoutButtonProps {
  weekId: string;
  dayOfWeek: WeekDay;
  planId: string;
  visible: boolean;
}

export function AddWorkoutButton({
  weekId,
  dayOfWeek,
  planId,
  visible,
}: AddWorkoutButtonProps) {
  const [showPopover, setPopoverVisibility] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async ({ type, description }: AddEditWorkoutInput) => {
    await dispatch(
      addWorkoutToDb({
        planId,
        weekId,
        description,
        type,
        dayOfWeek,
      }),
    );
    setPopoverVisibility(false);
  };

  const renderPopover = (props: OverlayInjectedProps) => (
    <AddEditWorkoutPopover
      id="addWorkoutPopover"
      editing={false}
      onSubmit={handleSubmit}
      props={props}
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
      <Button
        className={cn(styles.button, { invisible: !visible })}
        variant="light">
        + Add Workout
      </Button>
    </OverlayTrigger>
  );
}
