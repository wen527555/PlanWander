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
    ranges: any;
    onChange: (ranges: RangeKeyDict) => void;
    months?: number;
    direction?: 'horizontal' | 'vertical';
    rangeColors?: string[];
    autoFocus?: boolean;
  }

  export const DateRange: React.FC<DateRangeProps>;
}
