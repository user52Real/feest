'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { Event, EVENT_CATEGORIES } from '../types/events';

interface CalendarViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onDateClick: (date: Date) => void;
}

export default function CalendarView({ events, onEventClick, onDateClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleFilter = () => {
    let filtered = [...events];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(event => 
        event.tags.some(tag => selectedTags.includes(tag))
      );
    }
    
    setFilteredEvents(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [selectedCategory, selectedTags, events]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="all">All Categories</option>
            {EVENT_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(events.flatMap(event => event.tags))).map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTags(prev => 
                  prev.includes(tag) 
                    ? prev.filter(t => t !== tag)
                    : [...prev, tag]
                )}
                className={`px-2 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-gray-500 text-sm">
            {day}
          </div>
        ))}

        {daysInMonth.map(day => {
          const dayEvents = filteredEvents.filter(event => 
            format(new Date(event.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          );

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              className={`min-h-[100px] p-2 border border-gray-200 ${
                !isSameMonth(day, currentDate) ? 'bg-gray-50' :
                isToday(day) ? 'bg-blue-50' : 'bg-white'
              }`}
            >
              <div className="text-right text-sm text-gray-500">
                {format(day, 'd')}
              </div>
              <div className="mt-2">
                {dayEvents.map(event => (
                  <div
                    key={event._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={`
                      p-1 mb-1 rounded text-sm truncate cursor-pointer
                      ${event.isPublic ? 'bg-blue-100' : 'bg-gray-100'}
                    `}
                  >
                    {event.title}
                    {event.capacity && (
                      <span className="text-xs ml-1">
                        ({event.guests.length}/{event.capacity})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}