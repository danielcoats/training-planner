import { useState, useRef, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { updateWeekInDb, Week } from '../features/weeksSlice';
import { useAppDispatch } from '../hooks';
import { debounce } from 'lodash';

interface TrainingNotesProps {
  week: Week;
}

export function TrainingNotes({ week }: TrainingNotesProps) {
  const [notesText, setNotesText] = useState(week.notes || '');
  const dispatch = useAppDispatch();
  const debounced = useRef(
    debounce((value: string) => {
      dispatch(updateWeekInDb({ id: week.id, changes: { notes: value } }));
    }, 500),
  );

  // When notesText changes, call the debounced function
  useEffect(() => debounced.current(notesText), [notesText]);

  return (
    <Form.Group>
      <Form.Label>Training Notes</Form.Label>
      <Form.Control
        onChange={(e) => setNotesText(e.target.value)}
        value={notesText}
        as="textarea"
        rows={3}
      />
    </Form.Group>
  );
}
