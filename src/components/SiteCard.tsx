import React from 'react';
import { Zap } from 'lucide-react';
import type { Site } from '../types/site';

interface SiteCardProps {
  site: Site;
}

const SiteCard: React.FC<SiteCardProps> = ({ site }) => {
  const [width, setWidth] = React.useState(0);
  
  React.useEffect(() => {
    // Small delay to ensure the browser has painted the initial 0% state
    const timer = setTimeout(() => {
      setWidth(Math.min((site.capacity / 400) * 100, 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [site.capacity]);

  return (
    <div className="group bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 hover:border-primary-400/50 dark:hover:border-primary-500/50 transition-all duration-300 ease-out cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
            {site.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Active</span>
          </div>
        </div>
        <div className="p-2 bg-primary-50 dark:bg-primary-950/30 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
          <Zap className="w-5 h-5 text-primary-600" />
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-500 dark:text-slate-400">Total Capacity</span>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">{site.capacity} MW</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary-500 h-full transition-all duration-1000 ease-out"
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SiteCard;
