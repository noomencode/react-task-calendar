import * as React from 'react';
import styles from './TaskCalendar.module.scss';
import type { ITaskCalendarProps } from './ITaskCalendarProps';
import CalendarTable from './CalendarTable';
import { getQuarter, getQuarterMonths, getISOWeekNumber } from './utilities/dateCalculations';

export interface IDateObject {
  quarter: number,
  date: Date,
  week: number,
  year: number
  quarterMonths: IQuarterMonth[];
}

export interface IQuarterMonth {
  name: string, 
  index: number
  weeks: IWeek[];
}

export interface IWeek {
  weekNumber: number;
  startDate: string;  
  endDate: string;    
}

const TaskCalendar: React.FC<ITaskCalendarProps> = ({context}) => {

  const currentDate:Date = new Date();
  const currentYear:number = currentDate.getFullYear();
  const currentQuarter:number = getQuarter(currentDate);
  const currentWeek: number = getISOWeekNumber(currentDate);
  const currentQuarterMonths: IQuarterMonth[] = getQuarterMonths(currentQuarter,currentYear);

  const [dateObject,setDateObject] = React.useState<IDateObject>({ quarter: currentQuarter, date: currentDate, week: currentWeek, year: currentYear, quarterMonths: currentQuarterMonths });
  
  const updateDateObject = (date:Date):void =>  {
    setDateObject({ quarter: getQuarter(date), date: date, year: date.getFullYear(), week: getISOWeekNumber(date), quarterMonths: getQuarterMonths(getQuarter(date),date.getFullYear())})
  }

  const handleNavigation = (direction:string):void => {
    const newDate = new Date((dateObject.date).toString());
    if(direction === "forward")newDate.setMonth(newDate.getMonth()+3)
    else newDate.setMonth(newDate.getMonth()-3)
    updateDateObject(newDate);
  }
  
  // React.useEffect(()=>{
  //   updateDateObject(date);
  // },[date])

  return (
    <section className={`${styles.taskCalendar}`}>
      <div>
        <CalendarTable dateObject={dateObject} handleNavigation={handleNavigation}/>
      </div>
    </section>
  );
};

export default TaskCalendar;