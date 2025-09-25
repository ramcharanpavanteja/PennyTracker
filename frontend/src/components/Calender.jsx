import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // default styles

export default function MyCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="flex flex-col items-center mt-5">
      <Calendar
        onChange={setDate}
        value={date}
        className="rounded-lg shadow-lg p-2"
      />
      <p className="mt-4"> {date.toDateString()}</p>
    </div>
  );
}
