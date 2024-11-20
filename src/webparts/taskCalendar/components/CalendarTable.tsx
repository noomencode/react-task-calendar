import * as React from 'react';
import { IDateObject, IWeek, IQuarterMonth } from './interfaces/DateInterfaces';
import ITaskItem from './interfaces/ITaskItem';
import CalendarNavigator from './CalendarNavigator';
import { IconButton, IIconProps } from '@fluentui/react';
import styles from './TaskCalendar.module.scss';
import { formatDate, getISOWeekNumber } from './utilities/dateCalculations';

interface ICalendarTable {
  dateObject: IDateObject;
  taskItems: ITaskItem[] | undefined;
  handleNavigation: (direction:string)=>void;
}

const CalendarTable: React.FC<ICalendarTable> = ({dateObject, handleNavigation, taskItems}) => {

  const addIcon: IIconProps = { iconName: 'Add'}; 
  console.log(taskItems);

  const renderTaskRow = (task: ITaskItem) => {
    const taskStartWeek = getISOWeekNumber(new Date(task.StartDate));
    const taskEndWeek = getISOWeekNumber(new Date(task.EndDate))

    return (
      <tr key={task.Title}>
        <td>{task.Title}</td>
        <td>{formatDate(task.StartDate)}</td>
        <td>{formatDate(task.EndDate)}</td>
        {dateObject.quarterMonths.map((month: IQuarterMonth) =>
          month.weeks.map((week: IWeek) => {
            const isWithinRange = week.weekNumber >= taskStartWeek && week.weekNumber <= taskEndWeek;
            return (
              <td
                key={`${task.Title}-${week.weekNumber}`}
                className={isWithinRange ? styles.weekCell : undefined}
              />
            );
          })
        )}
      </tr>
    );
  };

  return (
      <div>
            <CalendarNavigator dateObject={dateObject} handleNavigation={handleNavigation}/>

            <table className={styles.calendarTable}>
              <thead>
                <tr>
                <th colSpan={3}>Task information</th>
                {dateObject.quarterMonths.map((month:IQuarterMonth)=>
                  <th colSpan={month.weeks.length} key={month.index}>{month.name}</th>
                )}
                </tr>
                <tr>
                  <th>Task name</th>
                  <th>Start date</th>
                  <th>End date</th>
                  {dateObject.quarterMonths.map((month:IQuarterMonth)=>
                    month.weeks.map((week:IWeek)=>
                    (<th key={week.weekNumber}>{`Week ${week.weekNumber}`}</th>))
                  )}
                </tr>
              </thead>
              <tbody>
                {taskItems?.length ? taskItems.map(renderTaskRow)
                  : 
                  <tr><td colSpan={3}><IconButton title="Add task" iconProps={addIcon}/>Add task</td></tr>}
              </tbody>
            </table>
      </div>
  );
};

export default CalendarTable;