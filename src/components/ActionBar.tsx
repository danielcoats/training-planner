import { useState } from 'react';
import { Button, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import {
  selectedPlanIdUpdated,
  sidebarVisibilitySet,
} from '../features/appSlice';
import { Plan, selectPlans } from '../features/plansSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { daysUntil } from '../utils/date-utils';
import styles from './actionBar.module.scss';
import { AddEditTrainingPlanModal } from './AddEditTrainingPlanModal';

interface ActionBarProps {
  plan: Plan;
}

export function ActionBar({ plan }: ActionBarProps) {
  const [modalShown, setModalShown] = useState(false);
  const [newPlanModal, setNewPlanModal] = useState(false);

  const plans = useAppSelector(selectPlans);
  const dispatch = useAppDispatch();

  const changePlanCallback = (planId: string) =>
    dispatch(selectedPlanIdUpdated(planId));

  const showAddEditPlanModal = (adding: boolean) => {
    if (adding) {
      setNewPlanModal(true);
    } else {
      setNewPlanModal(false);
    }
    setModalShown(true);
  };

  const otherPlans = plans.filter((p) => p.id !== plan.id);
  const planAbbrev =
    plan.name.length > 12 ? plan.name.substr(0, 12) + '…' : plan.name;

  const sidebarVisible = useAppSelector((state) => state.app.sidebarVisible);
  const toggleSidebarVisible = () => {
    dispatch(sidebarVisibilitySet(!sidebarVisible));
  };

  return (
    <>
      <Row>
        <Col>
          <DropdownButton
            title={planAbbrev}
            variant="light"
            size="lg"
            className="d-inline-block mr-1">
            {otherPlans.length > 0 && (
              <>
                {otherPlans.map((p) => (
                  <Dropdown.Item
                    key={p.id}
                    onSelect={() => changePlanCallback(p.id)}>
                    {p.name}
                  </Dropdown.Item>
                ))}
                <Dropdown.Divider />
              </>
            )}
            <Dropdown.Item onClick={() => showAddEditPlanModal(true)}>
              Add New
            </Dropdown.Item>
          </DropdownButton>
          <Button
            variant="light"
            size="lg"
            onClick={() => showAddEditPlanModal(false)}>
            Edit
          </Button>
        </Col>
        <Col xs={4} className="text-center">
          {plan.eventDate && (
            <div className={styles.daysUntil}>
              Days Until Event: {daysUntil(plan.eventDate)}
            </div>
          )}
        </Col>
        <Col className="d-flex justify-content-end">
          {/* TODO: implement sidebar */}
          {/* <Button
            className="mr-1"
            variant="light"
            size="lg"
            onClick={toggleSidebarVisible}>
            Workout Library
          </Button> */}
        </Col>
      </Row>
      <AddEditTrainingPlanModal
        show={modalShown}
        onHide={() => setModalShown(false)}
        plan={newPlanModal ? undefined : plan}
      />
    </>
  );
}
