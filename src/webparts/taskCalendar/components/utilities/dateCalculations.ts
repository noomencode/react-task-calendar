import { IQuarterMonth, IWeek } from "../interfaces/DateInterfaces";

export const getQuarter = (date: Date): number => {
    return Math.ceil((date.getMonth() + 1) / 3);
}
  export const includeWeekInMonth = (month:number, start: Date, end:Date): boolean => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const startMonth = startDateObj.getMonth();
    const endMonth = endDateObj.getMonth();
    const startYear = startDateObj.getFullYear();
    const lastDayOfStartMonth = new Date(startYear, startMonth + 1, 0).getDate();
    const startDate = startDateObj.getDate();
    const endDate = endDateObj.getDate();
    
    //If StartDate is not monthIndex then get last month's last date - startdate. If >= 3 then exclude
    if(startMonth !== month && lastDayOfStartMonth-startDate >= 3){
        return false;
    }
    //If EndDate is not monthIndex and >= 4 then exclude
    else if (endMonth !== month && endDate >= 4) {
        return false;
    }
    return true;
  }

  export const getISOWeekNumber = (date: Date): number => {
    const tempDate = new Date(date.getTime());
    //Set date to nearest Thursday. Since our weeks start from Monday, then if day is 0 we need to use 7 instead.
    tempDate.setDate(tempDate.getDate() + (4 - (tempDate.getDay() || 7)));
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    // Calculate full weeks to the nearest Thursday
    return Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  export const getWeeksInMonth = (monthIndex: number, year: number): IWeek[] => {

    const weeks: IWeek[] = [];
    const date = new Date(year, monthIndex, 1);

    // Loop and move date back until Monday
    while (date.getDay() !== 1) {
      date.setDate(date.getDate() - 1);
    }
  
    // Loop through the month, generating weeks. Conditions handle exceptions for January and December cases.
    // while (date.getMonth() <= monthIndex && date.getFullYear() <= year) {
     while (
    date.getFullYear() <= year && 
    (date.getMonth() === monthIndex || date.getMonth() === monthIndex - 1 || (date.getMonth() === 11 && monthIndex === 0))
  ) {
      const startOfWeek = new Date(date.getTime());
      // debugger;
      const endOfWeek = new Date(date.getTime());
      endOfWeek.setDate(date.getDate() + 6); 
      //Add only those weeks that have 4 or more days in the scope month.
      if(includeWeekInMonth(monthIndex,startOfWeek,endOfWeek)){
        weeks.push({
          weekNumber: getISOWeekNumber(startOfWeek),
          startDate: startOfWeek.toDateString(),
          endDate: endOfWeek.toDateString(),
        });
      }
      // Move to the next Monday and repeat
      date.setDate(date.getDate() + 7);
    }
    return weeks;
  };

 export const formatDate = (date:string):string => {
    const tempDate = new Date(date);
    const day = String(tempDate.getDate()).padStart(2, '0');
    const month = String(tempDate.getMonth() + 1).padStart(2, '0');
    const year = tempDate.getFullYear(); 
    return `${day}.${month}.${year}`; 
}

export const getQuarterMonths = (quarter: number, year:number): IQuarterMonth[] => {
    const monthNames = [
      'January', 'February', 'March',    // Q1
      'April', 'May', 'June',            // Q2
      'July', 'August', 'September',     // Q3
      'October', 'November', 'December', // Q4
    ];
    
  const startIndex = (quarter - 1) * 3;
  const months = monthNames.slice(startIndex, startIndex + 3).map((name, i) => {
    const monthIndex = startIndex + i;
    return {
      name,
      index: monthIndex, 
      weeks: getWeeksInMonth(monthIndex,year)
    }
  });
  return months;
};



