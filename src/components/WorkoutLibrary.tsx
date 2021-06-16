import { default as cn } from 'classnames';
import React from 'react';
import { Button } from 'react-bootstrap';
import { sidebarVisibilitySet } from '../features/appSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import styles from './workoutLibrary.module.scss';

export function WorkoutLibrary() {
  const sidebarVisible = useAppSelector((state) => state.app.sidebarVisible);

  const dispatch = useAppDispatch();
  const setSidebarVisbility = (visible: boolean) => {
    dispatch(sidebarVisibilitySet(visible));
  };

  return (
    <div
      className={cn(styles.sidebar, {
        [styles.sidebarVisible]: sidebarVisible,
      })}>
      <p>This the sidebar where you can choose from an existing workout.</p>
      <Button onClick={() => setSidebarVisbility(false)}>Close</Button>
    </div>
  );
}
