import * as React from 'react';
import { IDateObject, IWeek, IQuarterMonth } from './interfaces/DateInterfaces';
import ITaskItem from './interfaces/ITaskItem';
import CalendarNavigator from './CalendarNavigator';
import styles from './TaskCalendar.module.scss';
import { formatDate, getISOWeekNumber } from './utilities/dateCalculations';
import Form from './Form';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface ICalendarTable {
  dateObject: IDateObject;
  taskItems: ITaskItem[] | undefined;
  handleNavigation: (direction:string)=>void;
  context: WebPartContext;
  listId: string;
}

const CalendarTable: React.FC<ICalendarTable> = ({dateObject, handleNavigation, taskItems, context, listId}) => {

  console.log(taskItems);

  const renderTaskRow = (task: ITaskItem):React.ReactElement =>  {
    const taskStartWeek = getISOWeekNumber(new Date(task.StartDate));
    const taskEndWeek = getISOWeekNumber(new Date(task.EndDate))

    return (
      <tr key={task.Title}>
        <td title={task.Title} style={{whiteSpace:'nowrap', maxWidth:'150px', textOverflow:'ellipsis', overflow: 'hidden'}}>{task.Title}</td>
        <td>{formatDate(task.StartDate)}</td>
        <td>{formatDate(task.EndDate)}</td>
        {dateObject.quarterMonths.map((month: IQuarterMonth) =>
          month.weeks.map((week: IWeek) => {
            const isWithinRange = week.weekNumber >= taskStartWeek && week.weekNumber <= taskEndWeek;
            return (
              <td
                key={`${task.Title}-${week.weekNumber}`}
                className={isWithinRange ? styles.weekCell : undefined}
                title={`${formatDate(week.startDate)}-${formatDate(week.endDate)}`}
              />
            );
          })
        )}
      </tr>
    );
  };

  return (
      <div >
            <CalendarNavigator dateObject={dateObject} handleNavigation={handleNavigation}/>
            <div className={styles.calendarTableWrapper}>
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
                  {taskItems?.map(renderTaskRow)}
                  
                  {(taskItems?.length || 0) <= 9 ? <tr><td colSpan={3}><Form listId={listId} context={context}/></td></tr> : null}
                </tbody>
              </table>
            </div>
      </div>
  );
};

export default CalendarTable;