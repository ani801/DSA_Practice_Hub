import React, { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { Url } from "../App";

const CustomCalendar = () => {
  const today = dayjs();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [currentYear, setCurrentYear] = useState(today.year());

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Fetch yearly POTD data when year changes or on mount
  useEffect(() => {
    const fetchYearlyPotdData = async () => {
      try {
        const res = await axios.get(`${Url}/api/potd/yearly/${currentYear}`, {
          withCredentials: true,
        });
        const potdData = res.data?.potdMonth || [];
        setHighlightedDates(potdData);
      } catch (error) {
        console.error("Error fetching yearly POTD data:", error);
      }
    };

    fetchYearlyPotdData();
    console.log("Fetching POTD data for year:", currentYear);
  }, [currentYear]);

  // Update year if currentDate changes to a different year
  useEffect(() => {
    const newYear = currentDate.year();
    if (newYear !== currentYear) {
      setCurrentYear(newYear);
    }
  }, [currentDate]);

  // Get calendar days (memoized to avoid recalculating unnecessarily)
  const calendarDays = useMemo(() => {
    const startOfMonth = currentDate.startOf("month");
    const startDay = (startOfMonth.day() + 6) % 7; // Monday = 0
    const daysInMonth = currentDate.daysInMonth();
    const days = [];

    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(currentDate.date(i));
    }
    while (days.length % 7 !== 0) days.push(null);

    return days;
  }, [currentDate]);

  return (
    <div className="max-w-lg mx-auto p-2 bg-white rounded-xl shadow-md border">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
            className="px-1 py-1 text-gray-500 hover:text-gray-800"
          >
            {"<"}
          </button>
          <button
            onClick={() => setCurrentDate(currentDate.add(1, "month"))}
            className="px-1 py-1 text-gray-500 hover:text-gray-800"
          >
            {">"}
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-xs text-center text-gray-500 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-sm">
        {calendarDays.map((day, i) => {
          const formatted = day ? day.format("YYYY-MM-DD") : null;
          const isToday = day && day.isSame(today, "day");
          const isMarked = day && highlightedDates.includes(formatted);

          const boxStyle = !day
            ? ""
            :  isMarked
            ? "bg-blue-500 text-white"
            :isToday
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-800";

          return (
            <div
              key={i}
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${boxStyle}`}
            >
              {day ? day.date() : ""}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-around text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-green-600" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-blue-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-gray-100 border border-gray-300" />
          <span>Normal</span>
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;
