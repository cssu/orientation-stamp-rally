import React from 'react';

const scheduleData = [
    { time: '9:00am', event: 'Arrival' },
    { time: '9:30am', event: 'Opening Ceremony' },
    { time: '10:00am', event: 'Professors Panel' },
    { time: '11:00am', event: 'Meet Your Team' },
    { time: '11:30am', event: 'Scavenger Hunt' },
    { time: '12:35pm', event: 'Clubs Fair + Lunch' },
    { time: '2:00pm', event: 'Student Panel' },
    { time: '2:45pm', event: 'Closing Ceremony' },
];

const Schedule = ({ highlightedIndex = 4 }) => {
    return (
        <div className="w-full max-w-3xl mx-auto mt-8 rounded-lg overflow-hidden border border-slate-300">
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-slate-800">Event Schedule</h2>
                <div className="grid grid-cols-2 gap-3">
                    {scheduleData.map((item, index) => (
                        <React.Fragment key={index}>
                            <div className={`p-3 rounded-md text-slate-800 font-semibold transition-all duration-300 border border-slate-300 ${
                                index === highlightedIndex
                                    ? 'bg-orange-400 shadow-lg animate-float-slow'
                                    : 'bg-white'
                            }`}>
                                {item.time}
                            </div>
                            <div className={`p-3 rounded-md text-slate-800 font-semibold transition-all duration-300 border border-slate-300 ${
                                index === highlightedIndex
                                    ? 'bg-orange-400 shadow-lg animate-float-slow'
                                    : 'bg-white'
                            }`}>
                                {item.event}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Schedule;