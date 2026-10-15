import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { EVENT_DETAILS } from '../config';

export default function EventDetails() {
  const details = [
    {
      id: 'date',
      label: 'DATE',
      value: EVENT_DETAILS.dateDisplay, // Explicitly "HackHeist 2026"
      subtext: 'Official date announcement pending',
      icon: Calendar,
      color: 'text-[#fdf2f2]',
      badgeBg: 'bg-[#fdf2f2]/10 border-[#fdf2f2]/20',
    },
    {
      id: 'venue',
      label: 'VENUE',
      value: EVENT_DETAILS.venue, // Explicitly "MIET"
      subtext: 'Meerut Institute of Engineering & Technology',
      icon: MapPin,
      color: 'text-[#eaeafb]',
      badgeBg: 'bg-[#eaeafb]/10 border-[#eaeafb]/20',
    },
    {
      id: 'time',
      label: 'TIME',
      value: EVENT_DETAILS.time, // Explicitly "9:00 AM onwards"
      subtext: 'Reporting & check-in starts at 9:00 AM',
      icon: Clock,
      color: 'text-[#d6d5e7]',
      badgeBg: 'bg-[#d6d5e7]/10 border-[#d6d5e7]/20',
    }
  ];

  return (
    <section id="details" className="py-20 md:py-28 relative border-b border-[#544354]/60 bg-[#382c38]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#382c38] border border-[#544354] text-[#d6d5e7] text-xs font-mono font-medium">
            <span>SECTION // 04</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#fdf2f2] tracking-tight font-mono">
            Mark Your <span className="text-[#eaeafb]">Calendar</span>
          </h2>
          <p className="text-[#bebabf] text-base sm:text-lg">
            Your next big idea starts here.
          </p>
        </div>

        {/* 3 Event Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          {details.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-6 sm:p-8 rounded-xl panel-card transition-all duration-200 hover:-translate-y-1 shadow-subtle hover:border-[#725c72] flex flex-col justify-between"
              >
                <div>
                  {/* Icon Container */}
                  <div className={`w-12 h-12 rounded-lg ${item.badgeBg} border flex items-center justify-center mb-6`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>

                  {/* Label */}
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d6d5e7] block mb-1">
                    {item.label}
                  </span>

                  {/* Value */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#fdf2f2] tracking-tight font-mono mb-2">
                    {item.value}
                  </h3>
                </div>

                {/* Subtext info */}
                <p className="text-xs text-[#bebabf] pt-4 border-t border-[#544354]/80">
                  {item.subtext}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
