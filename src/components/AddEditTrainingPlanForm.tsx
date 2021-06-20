import { Button, Form } from 'react-bootstrap';
import { FormikErrors, useFormik } from 'formik';

export interface AddEditPlanInput {
  name: string;
  eventDate: Date | null;
}

const validate = (values: AddEditPlanInput) => {
  let errors: FormikErrors<AddEditPlanInput> = {};
  if (!values.name) {
    errors.name = 'Plan name is required';
  }
  return errors;
};

interface AddEditTrainingPlanFormProps {
  editing: boolean;
  onSubmit: (values: AddEditPlanInput) => Promise<void>;
  onDelete?: () => Promise<void>;
  initialValues?: AddEditPlanInput;
  size?: 'sm' | 'lg';
}

const DEFAULT_VALUES = {
  name: '',
  eventDate: null,
} as AddEditPlanInput;

export function AddEditTrainingPlanForm({
  editing,
  onSubmit,
  onDelete,
  initialValues,
  size,
}: AddEditTrainingPlanFormProps) {
  const formik = useFormik({
    initialValues: initialValues ?? DEFAULT_VALUES,
    onSubmit,
    validate,
  });

  return (
    <Form onSubmit={formik.handleSubmit} autoComplete="off">
      <Form.Group>
        <Form.Label>Name of your training plan</Form.Label>
        <Form.Control
          size={size}
          type="text"
          placeholder="E.g. Seattle Marathon"
          id="name"
          autoComplete="off"
          isValid={formik.touched.name && !formik.errors.name}
          isInvalid={formik.touched.name && formik.errors.name !== undefined}
          {...formik.getFieldProps('name')}
        />
      </Form.Group>
      <Button size={size} variant="primary" type="submit">
        {editing ? 'Save' : 'Create'}
      </Button>{' '}
      {editing && (
        <Button size={size} variant="danger" onClick={onDelete}>
          Delete
        </Button>
      )}
    </Form>
  );
}
