// types/react-date-range.d.ts

declare module 'react-date-range' {
  import React from 'react';

  export interface Range {
    startDate: Date;
    endDate: Date;
    key: string;
  }

  export interface RangeKeyDict {
    [key: string]: Range;
  }

  export interface DateRangeProps {
    ranges: RangeKeyDict;
    onChange: (ranges: RangeKeyDict) => void;
  }

  export const DateRange: React.FC<DateRangeProps>;
}
