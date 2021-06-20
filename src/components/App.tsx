import { Container, Nav, Navbar } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { selectPlans } from '../features/plansSlice';
import { useAppSelector } from '../hooks';
import { EmptyState } from './EmptyState';
import { TrainingPlanner } from './TrainingPlanner';
import styles from './app.module.scss';
import { default as cn } from 'classnames';
import { WorkoutLibrary } from './WorkoutLibrary';

export function App() {
  const plans = useAppSelector(selectPlans, shallowEqual);
  const loading = useAppSelector((state) => state.app.loading);
  const sidebarVisible = useAppSelector((state) => state.app.sidebarVisible);

  let screen = plans.length ? <TrainingPlanner /> : <EmptyState />;

  return (
    <>
      <div
        className={cn(styles.mainContainer, {
          [styles.sidebarVisible]: sidebarVisible,
        })}>
        <Navbar expand="lg" variant="dark" bg="dark" className="mb-3">
          <Container>
            <Navbar.Brand href="#">Running Training Planner</Navbar.Brand>
          </Container>
        </Navbar>
        {loading ? null : screen}
      </div>
      <WorkoutLibrary />
    </>
  );
}
