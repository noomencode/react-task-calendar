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