import { useState } from 'react';
import { Col } from 'react-bootstrap';
import { useDrop } from 'react-dnd';
import { WeekDay } from '../features/types';
import { updateWorkoutInDb, Workout } from '../features/workoutsSlice';
import { useAppDispatch } from '../hooks';
import { AddWorkoutButton } from './AddWorkoutButton';
import { WorkoutCard } from './WorkoutCard';
import styles from './trainingDay.module.scss';
import { default as cn } from 'classnames';

interface TrainingDayProps {
  workouts: Workout[];
  planId: string;
  weekId: string;
  dayOfWeek: WeekDay;
  lastWeek: boolean;
}

export function TrainingDay({
  workouts,
  planId,
  weekId,
  dayOfWeek,
  lastWeek,
}: TrainingDayProps) {
  const [addButtonShown, setAddButtonShown] = useState(false);
  const dispatch = useAppDispatch();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'workout',
    drop: (item: { id: string }) =>
      dispatch(
        updateWorkoutInDb({ id: item.id, changes: { dayOfWeek, weekId } }),
      ),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <Col
      ref={drop}
      key={dayOfWeek}
      className={cn(styles.cell, 'p-2 d-flex flex-column', {
        [styles.dragOver]: isOver,
        [styles.lastWeek]: lastWeek,
      })}
      onMouseEnter={() => setAddButtonShown(true)}
      onMouseLeave={() => setAddButtonShown(false)}>
      {workouts.map((workout, i) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
      <AddWorkoutButton
        visible={addButtonShown}
        planId={planId}
        weekId={weekId}
        dayOfWeek={dayOfWeek}
      />
    </Col>
  );
}
