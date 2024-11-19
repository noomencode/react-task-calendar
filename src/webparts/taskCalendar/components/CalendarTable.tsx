import * as React from 'react';
import { IDateObject, IQuarterMonth, IWeek } from './TaskCalendar';
import CalendarNavigator from './CalendarNavigator';
import { Stack } from '@fluentui/react';
import styles from './TaskCalendar.module.scss';
import TaskItem from './TaskItem';

interface ICalendarTable {
    dateObject: IDateObject;
    handleNavigation: (direction:string)=>void;
}

const CalendarTable: React.FC<ICalendarTable> = ({dateObject, handleNavigation}) => {

  const thCount = dateObject.quarterMonths.reduce(
    (acc, month: IQuarterMonth) => acc + month.weeks.length,
    0
  );

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
                  {dateObject.quarterMonths.map((month:IQuarterMonth)=>month.weeks.map((week:IWeek)=><th key={week.weekNumber}>{`Week ${week.weekNumber}`}</th>))}
                </tr>
              </thead>
              <tbody>
                
              <tr>
                <td>Task1</td>
                <td>Mon 18 Nov 2024</td>
                <td>Mon 02 Dev 2024</td>
          {Array.from({ length: thCount }).map((_, index) => (
            <td style={index%2?{background:'red'}:{}}key={index}/>
          ))}
        </tr>
              </tbody>
            </table>
      </div>
  );
};

export default CalendarTable;