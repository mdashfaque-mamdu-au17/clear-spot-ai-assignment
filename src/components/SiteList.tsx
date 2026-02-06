import React, { useState, useEffect } from 'react';
import { useSites } from '../hooks/useSites';
import { ChevronLeft, ChevronRight, RefreshCw, LayoutGrid } from 'lucide-react';
import SiteCard from './SiteCard';

const SiteList: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching, refetch } = useSites(page);

  // Auto-refresh when MSW might be ready if it was missed
  useEffect(() => {
    if (!data && !isLoading && !isFetching) {
      refetch();
    }
  }, [data, isLoading, isFetching, refetch]);

  if (isError) {
    return (
      <div className="p-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 dark:border-red-900/50">
          <RefreshCw className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Connection Problem</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">We couldn't reach the agentic mesh network. Please check your connection.</p>
        <button 
          onClick={() => refetch()}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold flex items-center justify-center mx-auto gap-2 shadow-lg shadow-primary-500/20 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" /> Try Reconnecting
        </button>
      </div>
    );
  }

  const pagination = data?.pagination;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-primary-500" />
             <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Real-time Status</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <LayoutGrid className="w-8 h-8 text-primary-600" />
            Operational Sites
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md">
            Overview of active power generation sites across the global mesh network.
          </p>
        </div>
        <button 
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-primary-600 transition-transform ${isFetching ? 'animate-spin' : 'group-hover:rotate-180 duration-500'}`} />
          {isFetching ? 'Syncing...' : 'Sync Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {isLoading && !data ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse shadow-sm" />
          ))
        ) : (
          data?.sites?.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))
        )}
      </div>

      {!isLoading && (data?.sites?.length ?? 0) === 0 && (
        <div className="p-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
           <p className="text-slate-400 font-medium">No active sites found for this range.</p>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-full border border-slate-200/50 dark:border-slate-700/50">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Showing <span className="text-slate-900 dark:text-white">{(page - 1) * 10 + 1}-{Math.min(page * 10, pagination.total)}</span> of <span className="text-slate-900 dark:text-white">{pagination.total}</span> active installations
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Page {page} of {pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === 1}
                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-primary-400 dark:hover:border-primary-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm active:scale-90 group cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </button>
              <button
                onClick={() => {
                  setPage(p => Math.min(pagination.totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === pagination.totalPages}
                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-primary-400 dark:hover:border-primary-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm active:scale-90 group cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteList;
