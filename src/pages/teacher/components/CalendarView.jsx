import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Trash2, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getEvents, createEvent, deleteEvent } from "@/services/classService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

const CalendarView = () => {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEvent, setNewEvent] = useState({ title: "", type: "class", time: "12:00" });

    useEffect(() => {
        if (user) fetchEvents();
    }, [user]);

    const fetchEvents = async () => {
        try {
            const data = await getEvents(user.uid);
            setEvents(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const handleDateClick = (day) => {
        setSelectedDate(day);
        setNewEvent({ ...newEvent, title: "", type: "class", time: "09:00" }); // Reset form
        setShowModal(true);
    };

    const handleAddEvent = async () => {
        if (!newEvent.title) return;
        try {
            await createEvent({
                title: newEvent.title,
                type: newEvent.type,
                date: selectedDate.toISOString(),
                time: newEvent.time
            }, user.uid);
            setShowModal(false);
            fetchEvents();
        } catch (error) {
            console.error("Failed to add event", error);
        }
    };

    const handleDeleteEvent = async (e, eventId) => {
        e.stopPropagation();
        if (confirm("Delete this event?")) {
            await deleteEvent(eventId);
            fetchEvents();
        }
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const getEventsForDay = (day) => {
        return events.filter(event => isSameDay(parseISO(event.date), day));
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'exam': return 'bg-[#E53935] text-white';
            case 'class': return 'bg-[#1A4D3E] text-white';
            case 'meeting': return 'bg-[#FBC02D] text-gray-900';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <Card className="border-none shadow-sm h-full bg-white relative">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100 p-6">
                <CardTitle className="text-lg font-bold text-[#1A4D3E] flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {format(currentDate, "MMMM yyyy")}
                </CardTitle>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="hover:bg-[#E8F5E9] text-[#1A4D3E]"><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={handleNextMonth} className="hover:bg-[#E8F5E9] text-[#1A4D3E]"><ChevronRight className="h-4 w-4" /></Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day, dayIdx) => {
                        const dayEvents = getEventsForDay(day);
                        return (
                            <div
                                key={dayIdx}
                                onClick={() => handleDateClick(day)}
                                className={cn(
                                    "min-h-[80px] rounded-xl border border-transparent p-1 transition-all cursor-pointer hover:border-[#1A4D3E]/30 hover:bg-[#F2F6F5] relative group",
                                    !isSameMonth(day, currentDate) && "text-gray-300 pointer-events-none",
                                    isSameDay(day, new Date()) && "bg-[#E8F5E9] border-[#1A4D3E]/20"
                                )}
                            >
                                <div className={cn("text-sm font-medium mb-1 pl-1", isSameDay(day, new Date()) ? "text-[#1A4D3E]" : "text-gray-700")}>
                                    {format(day, "d")}
                                </div>
                                <div className="space-y-1">
                                    {dayEvents.map(event => (
                                        <div key={event.id} className={cn("text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium flex items-center justify-between group/event", getTypeColor(event.type))}>
                                            <span>{event.time} {event.title}</span>
                                            <button onClick={(e) => handleDeleteEvent(e, event.id)} className="opacity-0 group-hover/event:opacity-100 hover:text-black/50 ml-1">
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {/* Add Button on Hover */}
                                <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-[#1A4D3E] text-white rounded-full p-1 shadow-sm">
                                        <Plus className="h-3 w-3" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>

            {/* Add Event Modal */}
            {showModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-2xl">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-80 border border-gray-100 animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-[#1A4D3E] mb-4">Add Event</h3>
                        <p className="text-sm text-gray-500 mb-4">{selectedDate && format(selectedDate, "MMMM d, yyyy")}</p>

                        <div className="space-y-3">
                            <div>
                                <Label className="text-xs">Title</Label>
                                <Input
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="h-8 text-sm focus-visible:ring-[#1A4D3E]"
                                    placeholder="Ex: Math Exam"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-xs">Time</Label>
                                    <Input
                                        type="time"
                                        value={newEvent.time}
                                        onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                                        className="h-8 text-sm focus-visible:ring-[#1A4D3E]"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Type</Label>
                                    <select
                                        className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-[#1A4D3E]"
                                        value={newEvent.type}
                                        onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                                    >
                                        <option value="class">Class</option>
                                        <option value="exam">Exam</option>
                                        <option value="meeting">Meeting</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <Button size="sm" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                            <Button size="sm" className="bg-[#1A4D3E] hover:bg-[#143D31]" onClick={handleAddEvent} disabled={!newEvent.title}>Add</Button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default CalendarView;
