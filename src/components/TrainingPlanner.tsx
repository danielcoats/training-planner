import { Fragment, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plan, selectPlanById, selectPlans } from '../features/plansSlice';
import { WeekDay } from '../features/types';
import {
  addWeekToDb,
  deleteWeekFromDb,
  selectWeeksByPlanId,
} from '../features/weeksSlice';
import {
  deleteWorkoutsByWeekIdFromDb,
  selectWorkouts,
} from '../features/workoutsSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { ActionBar } from './ActionBar';
import styles from './trainingPlanner.module.scss';
import { TrainingWeek } from './TrainingWeek';
import { default as cn } from 'classnames';
import { addSeedDataToPlan } from '../utils/development';
import { TrainingNotes } from './TrainingNotes';

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

  const handleClickDeleteWeek = (id: string) => {
    dispatch(deleteWeekFromDb(id));
    dispatch(deleteWorkoutsByWeekIdFromDb(id));
  };

  const handleClickAddTestData = async () => {
    await dispatch(addSeedDataToPlan(selectedPlan.id));
  };

  return (
    <Container>
      <ActionBar plan={selectedPlan} />
      <div className={styles.trainingCalendar}>
        <Row className={styles.calendarHeader}>
          <Col className={styles.headerCell} xs={1}></Col>
          {Object.values(WeekDay).map((day) => (
            <Col key={day} className={cn(styles.dayCell, styles.headerCell)}>
              {day}
            </Col>
          ))}
        </Row>
        <DndProvider backend={HTML5Backend}>
          {weeks.map((week, i) => {
            const lastWeek = i + 1 === weeks.length;
            const isSelected = selectedWeek === week.id;
            return (
              <Fragment key={week.id}>
                <Row className={cn(styles.weekWrapper, 'no-gutters')}>
                  <TrainingWeek
                    week={week}
                    weekNumber={i + 1}
                    onSelectWeek={(id) => setSelectedWeek(id)}
                    plan={selectedPlan}
                    workouts={workouts}
                    isSelected={isSelected}
                    lastWeek={lastWeek}
                  />
                </Row>
                {selectedWeek === week.id && (
                  <Row
                    className={cn(styles.notesWrapper, 'no-gutters p-3', {
                      [styles.lastWeek]: lastWeek,
                    })}>
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
                            onClick={() => handleClickDeleteWeek(week.id)}>
                            Delete Week
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )}
              </Fragment>
            );
          })}
        </DndProvider>
      </div>
      <Row className={cn(styles.actionRow, 'no-gutters')}>
        <Col>
          <Button variant="light" onClick={handleClickAddWeek}>
            + Add Week
          </Button>
          <Button
            className="float-right"
            variant="link"
            onClick={handleClickAddTestData}>
            Add Sample Data
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
