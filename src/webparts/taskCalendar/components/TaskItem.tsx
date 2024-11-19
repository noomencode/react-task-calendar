import * as React from 'react';
import styles from './TaskCalendar.module.scss';

interface ITaskItem {
  taskName:string,
  startDate:string,
  endDate:string,
}

const TaskItem: React.FC<ITaskItem> = () => {
  return (
      <>
        <tr>
          <td>Hello world</td>
          <td>Hello world</td>
          <td>Hello world</td>
        </tr>
      </>
  );
};

export default TaskItem;