import { Col } from 'react-bootstrap';
import { Plan } from '../features/plansSlice';
import { WeekDay } from '../features/types';
import { Week } from '../features/weeksSlice';
import { Workout } from '../features/workoutsSlice';
import styles from './trainingWeek.module.scss';
import { TrainingDay } from './TrainingDay';
import { default as cn } from 'classnames';

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
  return (
    <>
      <Col
        xs={1}
        className={cn(styles.weekNumber, {
          [styles.weekNumberSelected]: isSelected,
          [styles.lastWeek]: lastWeek,
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
          lastWeek={lastWeek}
          workouts={workouts.filter(
            (workout) =>
              workout.weekId === week.id && workout.dayOfWeek === day,
          )}
        />
      ))}
    </>
  );
}
