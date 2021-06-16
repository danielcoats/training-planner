import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Plan } from '../features/plansSlice';
import { WeekDay } from '../features/types';
import { deleteWeekFromDb, Week } from '../features/weeksSlice';
import {
  deleteWorkoutsByWeekIdFromDb,
  Workout,
} from '../features/workoutsSlice';
import styles from './trainingWeek.module.scss';
import { TrainingDay } from './TrainingDay';
import { TrainingNotes } from './TrainingNotes';
import { default as cn } from 'classnames';
import { useAppDispatch } from '../hooks';

interface TrainingWeekProps {
  week: Week;
  weekNumber: number;
  onSelectWeek: (id: string) => void;
  plan: Plan;
  workouts: Workout[];
  isSelected: boolean;
  lastWeek: boolean;
}

export function TrainingWeek({
  week,
  weekNumber,
  onSelectWeek,
  plan,
  workouts,
  isSelected,
  lastWeek,
}: TrainingWeekProps) {
  const dispatch = useAppDispatch();
  const handleDelete = () => {
    dispatch(deleteWeekFromDb(week.id));
    dispatch(deleteWorkoutsByWeekIdFromDb(week.id));
  };

  return (
    <div
      key={week.id}
      className={cn({
        [styles.lastWeek]: lastWeek && !isSelected,
      })}>
      <Row className={`no-gutters`}>
        <Col
          xs={1}
          className={cn(styles.weekNumber, 'col-1', {
            [styles.weekNumberSelected]: isSelected,
          })}
          onClick={() => onSelectWeek(isSelected ? '' : week.id)}>
          <div>{weekNumber}</div>
        </Col>
        {Object.values(WeekDay).map((day) => (
          <TrainingDay
            key={day}
            planId={plan.id}
            dayOfWeek={day}
            weekId={week.id}
            workouts={workouts.filter(
              (workout) =>
                workout.weekId === week.id && workout.dayOfWeek === day,
            )}
          />
        ))}
      </Row>
      {isSelected && (
        <Row className={`${styles.notesRow} no-gutters p-3`}>
          <Col>
            <Row>
              <Col>
                <TrainingNotes week={week} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  variant="danger"
                  className="float-right"
                  onClick={handleDelete}>
                  Delete Week
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
}
