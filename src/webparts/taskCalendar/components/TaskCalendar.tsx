import * as React from 'react';
import styles from './TaskCalendar.module.scss';
import { IQuarterMonth, IDateObject } from './interfaces/DateInterfaces';
import ITaskItem from './interfaces/ITaskItem';
import { ITaskCalendarProps } from './ITaskCalendarProps';
import CalendarTable from './CalendarTable';
import { getQuarter, getQuarterMonths, getISOWeekNumber } from './utilities/dateCalculations';
import DataService from '../services/DataService';

const TaskCalendar: React.FC<ITaskCalendarProps> = ({context}) => {

  const currentDate:Date = new Date();
  const currentYear:number = currentDate.getFullYear();
  const currentQuarter:number = getQuarter(currentDate);
  const currentWeek: number = getISOWeekNumber(currentDate);
  const currentQuarterMonths: IQuarterMonth[] = getQuarterMonths(currentQuarter,currentYear);
  const [taskItems,setTaskItems] = React.useState<ITaskItem[]>();
  const spService = new DataService();

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

  const fetchTaskItems = async ():Promise<void> => {
    const scope = dateObject.quarterMonths;
    const start = new Date(scope[0].weeks[0].startDate).toISOString();
    const end = new Date(scope[scope.length-1].weeks[scope[scope.length-1].weeks.length-1].endDate).toISOString();
    console.log(start, end);
    const data = await spService.getTaskItems(start,end);
    const items = data.map((i:ITaskItem)=>
    { return {Title: i.Title, StartDate: i.StartDate, EndDate: i.EndDate} }
  )
    setTaskItems(items);
  }
  
  React.useEffect(()=>{
    fetchTaskItems();
  },[dateObject])

  return (
    <section className={`${styles.taskCalendar}`}>
      <div>
        <CalendarTable dateObject={dateObject} handleNavigation={handleNavigation} taskItems={taskItems}/>
      </div>
    </section>
  );
};

export default TaskCalendar;