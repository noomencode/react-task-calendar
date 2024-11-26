import * as React from 'react';
import { IDateObject, IWeek, IQuarterMonth } from './interfaces/DateInterfaces';
import { IconButton, IIconProps } from '@fluentui/react';
import ITaskItem from './interfaces/ITaskItem';
import CalendarNavigator from './CalendarNavigator';
import styles from './TaskCalendar.module.scss';
import { formatDate } from './utilities/dateCalculations';
import Form from './Form';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useBoolean } from '@fluentui/react-hooks';


interface ICalendarTable {
  dateObject: IDateObject;
  taskItems: ITaskItem[] | undefined;
  handleNavigation: (direction:string)=>void;
  handleFormSubmit: ()=>void;
  context: WebPartContext;
  listId: string;
}

const CalendarTable: React.FC<ICalendarTable> = ({dateObject, handleNavigation, taskItems, context, listId, handleFormSubmit}) => {
  const [isFormOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [formType, setFormType] = React.useState<"Add" | "Edit">("Add");
  const [listItemId, setListItemId] = React.useState<number|undefined>(undefined);

  const buttonStyles = { root: { marginRight: 8 } };
  const addIcon: IIconProps = { iconName: 'Add'}; 

  const handleFormOpen = (type:"Add" | "Edit", listItemId?: number):void => {
    setFormType(type);
    setListItemId(listItemId)
    openPanel()
  }

  const handleFormDismiss = ():void => {
    setListItemId(undefined);
    dismissPanel()
  }

  const renderTaskRow = (task: ITaskItem):React.ReactElement =>  {

    return (
      <tr key={task.Title}>
        <td onClick={()=>handleFormOpen("Edit", task.Id)} className={styles.taskName} title={task.Title}>{task.Title}</td>
        <td>{formatDate(task.StartDate)}</td>
        <td>{formatDate(task.EndDate)}</td>
        {dateObject.quarterMonths.map((month: IQuarterMonth) =>
          month.weeks.map((week: IWeek) => {
              const isWithinRange = new Date(task.StartDate) <= new Date(week.endDate) && new Date(task.EndDate) >= new Date(week.startDate);
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
                  
                  <tr><td colSpan={3}><div className={styles.addTask}>
                    <IconButton styles={buttonStyles} title="Add task" iconProps={addIcon} onClick={()=>handleFormOpen("Add")}/><span>Add task</span>
                    </div></td></tr>
                </tbody>
              </table>
            </div>
            <Form isFormOpen={isFormOpen} onDismiss={handleFormDismiss} listId={listId} context={context} formType={formType} listItemId={listItemId} handleFormSubmit={handleFormSubmit}/>
      </div>
  );
};

export default CalendarTable;