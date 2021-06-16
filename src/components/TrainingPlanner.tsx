import { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plan, selectPlanById, selectPlans } from '../features/plansSlice';
import { WeekDay } from '../features/types';
import { addWeekToDb, selectWeeksByPlanId } from '../features/weeksSlice';
import { selectWorkouts } from '../features/workoutsSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { ActionBar } from './ActionBar';
import styles from './trainingPlanner.module.scss';
import { TrainingWeek } from './TrainingWeek';

export function TrainingPlanner() {
  const [selectedWeek, setSelectedWeek] = useState('');

  const selectedPlan = useAppSelector((state) => {
    const { selectedPlanId } = state.app;
    if (selectedPlanId) {
      const plan: Plan | undefined = selectPlanById(state, selectedPlanId);
      if (plan) {
        return plan;
      }
    }
    return selectPlans(state)[0];
  });

  const workouts = useAppSelector(selectWorkouts);
  const weeks = useAppSelector((state) =>
    selectWeeksByPlanId(state, selectedPlan.id),
  );

  const dispatch = useAppDispatch();

  const handleClickAddWeek = () => {
    dispatch(
      addWeekToDb({ planId: selectedPlan.id, position: weeks.length + 1 }),
    );
  };

  return (
    <Container>
      <ActionBar plan={selectedPlan} />
      <div className={styles.trainingCalendar}>
        <Row className={styles.calendarHeader}>
          <Col xs={1}></Col>
          {Object.values(WeekDay).map((day) => (
            <Col key={day}>{day}</Col>
          ))}
        </Row>
        <DndProvider backend={HTML5Backend}>
          {weeks.map((week, i) => (
            <div key={week.id} className={styles.trainingWeek}>
              <TrainingWeek
                week={week}
                weekNumber={i + 1}
                onSelectWeek={(id) => setSelectedWeek(id)}
                plan={selectedPlan}
                workouts={workouts}
                isSelected={selectedWeek === week.id}
                lastWeek={i + 1 === weeks.length}
              />
            </div>
          ))}
        </DndProvider>
      </div>
      <Row className="no-gutters">
        <Button
          className={styles.addWeekButton}
          variant="light"
          onClick={handleClickAddWeek}>
          + Add Week
        </Button>
      </Row>
    </Container>
  );
}
