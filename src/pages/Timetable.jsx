import React, { useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import { useLogContext } from '../context/LogContext';
import { useTheme } from '../context/ThemeContext';
// Styles
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const Timetable = () => {
    const { calendarEvents, addEvent, updateEvent } = useLogContext();
    const { darkMode } = useTheme();

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: new Date(),
        end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
        type: 'work'
    });

    const moveEvent = useCallback(
        ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
            const { allDay } = event;
            if (!allDay && droppedOnAllDaySlot) {
                event.allDay = true;
            }
            if (allDay && !droppedOnAllDaySlot) {
                event.allDay = false;
            }

            updateEvent({ ...event, start, end });
        },
        [updateEvent]
    );

    const resizeEvent = useCallback(
        ({ event, start, end }) => {
            updateEvent({ ...event, start, end });
        },
        [updateEvent]
    );

    const handleSelectSlot = useCallback(
        ({ start, end }) => {
            setNewEvent({
                title: '',
                start,
                end,
                type: 'work'
            });
            setShowModal(true);
        },
        []
    );

    const handleAddEventClick = () => {
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        setNewEvent({
            title: '',
            start: now,
            end: oneHourLater,
            type: 'work'
        });
        setShowModal(true);
    };

    const handleSaveEvent = () => {
        if (!newEvent.title.trim()) {
            alert('Please enter an event title');
            return;
        }

        if (newEvent.end <= newEvent.start) {
            alert('End time must be after start time');
            return;
        }

        addEvent({
            title: newEvent.title,
            start: newEvent.start,
            end: newEvent.end,
            type: newEvent.type
        });

        setShowModal(false);
        setNewEvent({
            title: '',
            start: new Date(),
            end: new Date(new Date().getTime() + 60 * 60 * 1000),
            type: 'work'
        });
    };

    const handleModalChange = (field, value) => {
        setNewEvent(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const eventStyleGetter = (event) => {
        let backgroundColor = '#3174ad';
        if (event.type === 'personal') backgroundColor = '#eab308'; // yellow-500
        if (event.type === 'work') backgroundColor = '#3b82f6'; // blue-500
        if (event.type === 'other') backgroundColor = '#8b5cf6'; // purple-500

        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    const formatDateTimeLocal = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <div className={`min-h-screen p-6 pt-24 md:pt-28 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className={`max-w-7xl mx-auto rounded-3xl p-6 shadow-2xl backdrop-blur-xl border border-opacity-20
            ${darkMode
                    ? 'bg-gray-800/60 border-gray-700'
                    : 'bg-white/60 border-white'}`}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold">📅 Your Timetable</h1>
                        <p className="mt-2 opacity-70">
                            Drag and drop events to reschedule. Click on an empty slot to create a new task.
                        </p>
                    </div>
                    <button
                        onClick={handleAddEventClick}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg transform transition-all hover:scale-105 flex items-center gap-2"
                    >
                        <span className="text-xl">+</span>
                        Add Event
                    </button>
                </div>

                <div className="h-[600px] text-black">
                    <DnDCalendar
                        localizer={localizer}
                        events={calendarEvents}
                        onEventDrop={moveEvent}
                        onEventResize={resizeEvent}
                        onSelectSlot={handleSelectSlot}
                        selectable
                        resizable
                        defaultView="week"
                        eventPropGetter={eventStyleGetter}
                        className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-100/90' : 'bg-white/90'}`}
                    />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`rounded-2xl shadow-2xl max-w-md w-full p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className="text-2xl font-bold mb-6">Create New Event</h2>

                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Event Title</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => handleModalChange('title', e.target.value)}
                                    placeholder="e.g., Team Meeting"
                                    className={`w-full p-3 rounded-lg border outline-none transition-all ${darkMode
                                            ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                                            : 'bg-gray-100 border-gray-300 focus:border-blue-500'
                                        }`}
                                />
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Start Time</label>
                                <input
                                    type="datetime-local"
                                    value={formatDateTimeLocal(newEvent.start)}
                                    onChange={(e) => handleModalChange('start', new Date(e.target.value))}
                                    className={`w-full p-3 rounded-lg border outline-none transition-all ${darkMode
                                            ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                                            : 'bg-gray-100 border-gray-300 focus:border-blue-500'
                                        }`}
                                />
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">End Time</label>
                                <input
                                    type="datetime-local"
                                    value={formatDateTimeLocal(newEvent.end)}
                                    onChange={(e) => handleModalChange('end', new Date(e.target.value))}
                                    className={`w-full p-3 rounded-lg border outline-none transition-all ${darkMode
                                            ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                                            : 'bg-gray-100 border-gray-300 focus:border-blue-500'
                                        }`}
                                />
                            </div>

                            {/* Event Type */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Event Type</label>
                                <select
                                    value={newEvent.type}
                                    onChange={(e) => handleModalChange('type', e.target.value)}
                                    className={`w-full p-3 rounded-lg border outline-none transition-all ${darkMode
                                            ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                                            : 'bg-gray-100 border-gray-300 focus:border-blue-500'
                                        }`}
                                >
                                    <option value="work">🔵 Work</option>
                                    <option value="personal">🟡 Personal</option>
                                    <option value="other">🟣 Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${darkMode
                                        ? 'bg-gray-700 hover:bg-gray-600'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEvent}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow-lg transition-all"
                            >
                                Save Event
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Timetable;
