import { Button, Form } from 'react-bootstrap';
import { FormikErrors, useFormik } from 'formik';
import { isValidDate } from '../utils/date-utils';
import DatePicker from 'react-datepicker';
import { default as cn } from 'classnames';

export interface AddEditPlanInput {
  name: string;
  eventDate: Date | null;
}

const validate = (values: AddEditPlanInput) => {
  let errors: FormikErrors<AddEditPlanInput> = {};
  if (!values.name) {
    errors.name = 'Plan name is required';
  } else if (values.eventDate !== null && !isValidDate(values.eventDate)) {
    errors.eventDate = 'Invalid date';
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

  const handleEventDateChange = (date: Date | null) => {
    formik.setFieldValue('eventDate', date);
  };

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
      <Form.Group>
        <Form.Label>Event Date (Optional)</Form.Label>
        <DatePicker
          id="eventDate"
          name="eventDate"
          autoComplete="off"
          selected={formik.values.eventDate}
          onChange={handleEventDateChange}
          onCalendarClose={() => formik.setFieldTouched('eventDate')}
          wrapperClassName="w-100"
          className={cn(`form-control form-control-${size}`, {
            'is-valid':
              formik.touched.eventDate && formik.errors.eventDate === undefined,
          })}
          isClearable
          placeholderText="Select the date"
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
