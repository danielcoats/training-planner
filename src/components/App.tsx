import { Badge, Col, Container, Navbar, Row } from 'react-bootstrap';
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
            <Navbar.Brand href="#">
              Running Training Planner{' '}
              <Badge variant="light" className={styles.previewBadge}>
                Preview
              </Badge>
            </Navbar.Brand>
          </Container>
        </Navbar>
        {loading ? null : screen}
      </div>
      <WorkoutLibrary />
      <footer className={cn(styles.footer, 'footer mt-auto py-3')}>
        <Container>
          <Row>
            <Col>
              <span className="text-muted">
                Built by{' '}
                <a
                  className="text-muted"
                  target="_blank"
                  rel="noreferrer"
                  href="https://danielcoats.nz">
                  Daniel Coats
                </a>
              </span>
            </Col>
            <Col>
              <span className="text-muted float-right">
                <a
                  className="text-muted"
                  target="_blank"
                  rel="noreferrer"
                  href="https://github.com/danielcoats/training-planner">
                  GitHub
                </a>
              </span>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}
