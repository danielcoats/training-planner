import { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Col,
  Dropdown,
  DropdownButton,
  Row,
} from 'react-bootstrap';
import { db } from '../db';
import { selectedPlanIdUpdated } from '../features/appSlice';
import { Plan, selectPlans } from '../features/plansSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { AddEditTrainingPlanModal } from './AddEditTrainingPlanModal';
import { exportDB } from 'dexie-export-import';

interface ActionBarProps {
  plan: Plan;
}

async function exportAsJson() {
  const blob = await exportDB(db);
  download(blob);
}

function download(blob: Blob) {
  const anchor = window.document.createElement('a');
  anchor.href = window.URL.createObjectURL(blob);
  anchor.download = 'training-planner-export.json';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(anchor.href);
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
    plan.name.length > 30 ? plan.name.substr(0, 30) + '…' : plan.name;

  return (
    <>
      <Row>
        <Col>
          <ButtonGroup>
            <Button
              variant="light"
              size="lg"
              as={ButtonGroup}
              onClick={() => showAddEditPlanModal(false)}>
              {planAbbrev}
            </Button>
            <DropdownButton
              variant="light"
              size="lg"
              as={ButtonGroup}
              title="">
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
          </ButtonGroup>
        </Col>
        <Col className="d-flex justify-content-end">
          <Button variant="light" size="lg" onClick={() => exportAsJson()}>
            Download
          </Button>
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
