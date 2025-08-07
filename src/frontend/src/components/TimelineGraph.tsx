import React from 'react';
import { EmployeeCallLog } from '../services/apiService';

interface TimelineGraphProps {
  callLogs: EmployeeCallLog[];
}

const TimelineGraph: React.FC<TimelineGraphProps> = ({ callLogs }) => {
  // Work day hours (8 AM to 6 PM)
  const workDayStart = 8;
  const workDayEnd = 18;
  const workDayHours = workDayEnd - workDayStart;

  // Generate time slots for the timeline
  const timeSlots = Array.from({ length: workDayHours + 1 }, (_, i) => workDayStart + i);

  // Parse call length to get duration in seconds
  const parseCallLength = (callLength: string): number => {
    const parts = callLength.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[1]) || 0;
      const seconds = parseInt(parts[2]) || 0;
      return hours * 3600 + minutes * 60 + seconds;
    }
    return 0;
  };

  // Mock time distribution for calls (in a real app, you'd parse actual timestamps)
  const getCallPosition = (call: EmployeeCallLog, index: number) => {
    // Distribute calls evenly across the timeline width
    const totalWidth = 100; // 100% width
    const barWidth = 2; // 2% width per bar
    const spacing = (totalWidth - (callLogs.length * barWidth)) / (callLogs.length + 1);
    const leftPosition = spacing + (index * (barWidth + spacing));
    return { leftPosition, barWidth };
  };

  const formatTime = (hour: number) => {
    return `${hour}:00`;
  };

  const getDirectionColor = (direction: string) => {
    switch (direction.toLowerCase()) {
      case 'incoming':
        return 'bg-green-500';
      case 'outgoing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Calculate max call duration for scaling
  const maxCallDuration = Math.max(...callLogs.map(call => parseCallLength(call.callLength)));
  const maxBarHeight = 80; // Maximum height in pixels

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {callLogs.length} call{callLogs.length !== 1 ? 's' : ''} for{' '}
        <span className="font-semibold text-blue-600 dark:text-blue-400 text-base">{callLogs[0]?.employeeName || 'employees'}</span> throughout the work day
      </div>
      
      {/* Timeline Header */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Work Day Timeline</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Incoming</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Outgoing</span>
            </div>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="relative">
          {/* Time labels */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            {timeSlots.map((hour) => (
              <span key={hour} className="w-16 text-center">
                {formatTime(hour)}
              </span>
            ))}
          </div>

          {/* Timeline track */}
          <div className="relative h-48 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            {/* Hour markers */}
            <div className="absolute inset-0 flex">
              {timeSlots.slice(0, -1).map((hour) => (
                <div key={hour} className="flex-1 border-r border-gray-100 dark:border-gray-700"></div>
              ))}
            </div>

            {/* Call bars grouped by time slots */}
            {timeSlots.slice(0, -1).map((hour, hourIndex) => {
              const hourCalls = callLogs.filter((_, index) => index % workDayHours === hourIndex);
              const incomingCalls = hourCalls.filter(call => call.direction.toLowerCase() === 'incoming');
              const outgoingCalls = hourCalls.filter(call => call.direction.toLowerCase() === 'outgoing');
              
              const leftPercent = (hour - workDayStart) / workDayHours * 100;
              const slotWidth = 100 / workDayHours;
              
              return (
                <div key={hour} className="absolute h-full flex items-end px-1" style={{ left: `${leftPercent}%`, width: `${slotWidth}%` }}>
                  {/* Incoming calls */}
                  {incomingCalls.map((call, callIndex) => {
                    const callDuration = parseCallLength(call.callLength);
                    const barHeight = maxCallDuration > 0 ? (callDuration / maxCallDuration) * maxBarHeight : 20;
                    
                    return (
                      <div
                        key={`incoming-${call.id}`}
                        className="relative group cursor-pointer"
                        style={{
                          width: `${100 / Math.max(1, incomingCalls.length + outgoingCalls.length)}%`,
                          height: `${Math.max(4, barHeight)}px`,
                        }}
                      >
                        <div className="w-full h-full bg-green-500 rounded-t-sm shadow-md group-hover:shadow-lg transition-shadow duration-200"></div>
                        
                        {/* Call tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                          <div className="font-semibold">{call.employeeName}</div>
                          <div>{call.customerName}</div>
                          <div>Duration: {call.callLength}</div>
                          <div className="text-gray-300">{call.direction}</div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Outgoing calls */}
                  {outgoingCalls.map((call, callIndex) => {
                    const callDuration = parseCallLength(call.callLength);
                    const barHeight = maxCallDuration > 0 ? (callDuration / maxCallDuration) * maxBarHeight : 20;
                    
                    return (
                      <div
                        key={`outgoing-${call.id}`}
                        className="relative group cursor-pointer"
                        style={{
                          width: `${100 / Math.max(1, incomingCalls.length + outgoingCalls.length)}%`,
                          height: `${Math.max(4, barHeight)}px`,
                        }}
                      >
                        <div className="w-full h-full bg-blue-500 rounded-t-sm shadow-md group-hover:shadow-lg transition-shadow duration-200"></div>
                        
                        {/* Call tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                          <div className="font-semibold">{call.employeeName}</div>
                          <div>{call.customerName}</div>
                          <div>Duration: {call.callLength}</div>
                          <div className="text-gray-300">{call.direction}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{callLogs.length}</div>
          <div className="text-sm text-blue-800 dark:text-blue-200">Total Calls</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {callLogs.filter(call => call.direction.toLowerCase() === 'incoming').length}
          </div>
          <div className="text-sm text-green-800 dark:text-green-200">Incoming</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {callLogs.filter(call => call.direction.toLowerCase() === 'outgoing').length}
          </div>
          <div className="text-sm text-purple-800 dark:text-purple-200">Outgoing</div>
        </div>
      </div>
    </div>
  );
};

export default TimelineGraph; 