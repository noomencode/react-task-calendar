import * as React from 'react';
import styles from './TaskCalendar.module.scss';
import { IconButton, Stack, IIconProps } from '@fluentui/react';
import { IDateObject } from './TaskCalendar';


interface ITableHeader {
    dateObject:IDateObject;
    handleNavigation: (direction:string)=>void;
}

const CalendarNavigator: React.FC<ITableHeader> = ({dateObject, handleNavigation}) => {

    const arrowLeftIcon: IIconProps = { iconName: 'Back'};
    const arrowRightIcon: IIconProps = { iconName: 'Forward'};
    const iconButtonStyles = {
        root: { fontSize: 24 }, 
        icon: { fontSize: 24 }, 
      };

  return (
      <>
        <Stack tokens={{ childrenGap: 8 }} horizontal horizontalAlign='center'>
            <IconButton iconProps={arrowLeftIcon} styles={iconButtonStyles} onClick={()=>handleNavigation('back')}/>
            <div className={styles.navigator}>{`Quarter ${dateObject.quarter}, ${dateObject.year}`}</div>
            <IconButton iconProps={arrowRightIcon} styles={iconButtonStyles} onClick={()=>handleNavigation('forward')}/>
        </Stack>
      </>

  );
};

export default CalendarNavigator;