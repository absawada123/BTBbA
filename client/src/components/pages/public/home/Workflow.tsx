// client/src/components/pages/public/home/Workflow.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, MessageCircle, Flower2, Truck, PartyPopper } from 'lucide-react';

interface Step { title: string; description: string; }
interface WorkflowProps { steps: Step[]; }

const stepIcons = [
  <ClipboardList className="h-6 w-6" />,
  <MessageCircle className="h-6 w-6" />,
  <Flower2       className="h-6 w-6" />,
  <Truck         className="h-6 w-6" />,
  <PartyPopper   className="h-6 w-6" />,
];

const Workflow: React.FC<WorkflowProps> = ({ steps }) => {
  return (
    <section id="workflow" className="scroll-mt-24 bg-[#FAF6F0] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-[#6B7C5C]/30 bg-[#6B7C5C]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#6B7C5C]">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-bold text-[#2C2C2C] sm:text-4xl">
            From idea to
            <span className="ml-2 italic font-serif text-[#C4717A]">your hands</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#2C2C2C]/60 sm:text-base leading-relaxed">
            Ordering is simple. We handle everything — you just enjoy the blooms.
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-10 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-[#C4717A]/20 to-transparent lg:block" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <div key={i} className="group relative flex flex-col items-center text-center">
                <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#C4717A]/15 bg-white text-[#C4717A] shadow-md transition-all duration-300 group-hover:border-[#C4717A]/40 group-hover:bg-[#C4717A] group-hover:text-white group-hover:shadow-lg group-hover:-translate-y-1">
                  {stepIcons[i]}
                  <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#C4717A] text-[10px] font-bold text-white shadow group-hover:bg-[#2C2C2C]">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[#2C2C2C] group-hover:text-[#C4717A] transition-colors">{step.title}</h3>
                <p className="mt-2 text-xs text-[#2C2C2C]/55 leading-relaxed px-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/inquiry" className="inline-flex items-center gap-2 rounded-full bg-[#2C2C2C] px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#C4717A] hover:shadow-lg active:scale-95">
            <Flower2 className="h-4 w-4" />
            Place Your Order Now
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Workflow;