import React from 'react';
import { Code2, GraduationCap, Mic, Users, ArrowUpRight } from 'lucide-react';

export default function Highlights() {
  const cards = [
    {
      id: 'hackathon',
      title: 'HACKATHON',
      description: 'Build and showcase your ideas.',
      icon: Code2,
      accentText: 'text-[#fdf2f2]',
      badgeBg: 'bg-[#fdf2f2]/10 border-[#fdf2f2]/20',
      tag: 'Collaborative Build'
    },
    {
      id: 'workshop',
      title: 'WORKSHOP',
      description: 'Learn practical development skills.',
      icon: GraduationCap,
      accentText: 'text-[#eaeafb]',
      badgeBg: 'bg-[#eaeafb]/10 border-[#eaeafb]/20',
      tag: 'Hands-on Learning'
    },
    {
      id: 'tech-session',
      title: 'TECH SESSION',
      description: 'Learn about technology and development.',
      icon: Mic,
      accentText: 'text-[#d6d5e7]',
      badgeBg: 'bg-[#d6d5e7]/10 border-[#d6d5e7]/20',
      tag: 'Speaker Insights'
    },
    {
      id: 'networking',
      title: 'NETWORKING',
      description: 'Connect with students and the developer community.',
      icon: Users,
      accentText: 'text-[#fdf2f2]',
      badgeBg: 'bg-[#bebabf]/10 border-[#bebabf]/20',
      tag: 'Community Exchange'
    },
  ];

  return (
    <section id="highlights" className="py-20 md:py-28 relative border-b border-[#544354]/60 tech-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#382c38] border border-[#544354] text-[#d6d5e7] text-xs font-mono font-medium">
            <span>SECTION // 03</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#fdf2f2] tracking-tight font-mono">
            Experience <span className="text-[#eaeafb]">HackHeist</span>
          </h2>
          <p className="text-[#bebabf] text-base sm:text-lg">
            Learn new skills. Build bold ideas. Connect with the community.
          </p>
        </div>

        {/* Exactly 4 Highlight Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group flex flex-col justify-between p-6 rounded-xl panel-card transition-all duration-200 hover:-translate-y-1 shadow-subtle hover:border-[#725c72]"
              >
                <div>
                  {/* Card Index & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-10 h-10 rounded-lg ${card.badgeBg} border flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${card.accentText}`} />
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#d6d5e7]">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-base font-bold text-[#fdf2f2] tracking-wide mb-2 font-mono">
                    {card.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-sm text-[#bebabf] leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                {/* Subdued Bottom Tag */}
                <div className="pt-5 mt-5 border-t border-[#544354]/80 flex items-center justify-between text-xs text-[#d6d5e7]">
                  <span className="font-mono text-[11px] uppercase tracking-wider">{card.tag}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#d6d5e7] group-hover:text-[#fdf2f2] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
