import { FormikErrors, useFormik } from 'formik';
import { Button, Form, Popover } from 'react-bootstrap';
import { OverlayInjectedProps } from 'react-bootstrap/esm/Overlay';

const WORKOUT_TYPES = [
  'Run',
  'Time Trial',
  'Fartlek',
  'Cross-train',
  'Long run',
  'Intervals',
];

const DEFAULT_VALUES = {
  type: 'Run',
  description: '',
} as AddEditWorkoutInput;

export interface AddEditWorkoutInput {
  type: string;
  description: string;
}

const validate = (values: AddEditWorkoutInput) => {
  let errors: FormikErrors<AddEditWorkoutInput> = {};
  if (!values.type) {
    errors.type = 'Type is required';
  } else if (!values.description) {
    errors.description = 'Description is required';
  }
  return errors;
};

interface AddEditWorkoutPopoverProps {
  id: string;
  editing: boolean;
  onSubmit: (values: AddEditWorkoutInput) => Promise<void>;
  props: OverlayInjectedProps;
  initialValues?: AddEditWorkoutInput;
  onDelete?: () => void;
  onCopy?: () => void;
}

export function AddEditWorkoutPopover({
  id,
  editing,
  onSubmit,
  props,
  initialValues,
  onDelete,
  onCopy,
}: AddEditWorkoutPopoverProps) {
  const formik = useFormik({
    initialValues: initialValues ?? DEFAULT_VALUES,
    onSubmit,
    validate,
  });

  return (
    <Popover id={id} {...props}>
      <Popover.Content>
        <Form noValidate onSubmit={formik.handleSubmit} autoComplete="off">
          <Form.Group>
            <Form.Control
              as="select"
              size="sm"
              id="type"
              {...formik.getFieldProps('type')}
              custom>
              {WORKOUT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Description"
              id="description"
              {...formik.getFieldProps('description')}
            />
          </Form.Group>
          <Button size="sm" variant="primary" type="submit">
            {editing ? 'Update' : 'Add Workout'}
          </Button>{' '}
          {editing && (
            <>
              <Button size="sm" variant="danger" onClick={onDelete}>
                Delete
              </Button>{' '}
              <Button size="sm" variant="link" onClick={onCopy}>
                Copy
              </Button>
            </>
          )}
        </Form>
      </Popover.Content>
    </Popover>
  );
}
