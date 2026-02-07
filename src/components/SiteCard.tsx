import React, { useState, useEffect, useRef } from 'react';
import { Zap, Edit2, Check, X, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../context/ToastContext';
import type { Site } from '../types/site';
import api from '../lib/api';

interface SiteCardProps {
  site: Site;
}

const SiteCard: React.FC<SiteCardProps> = ({ site }) => {
  const [width, setWidth] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(site.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(Math.min((site.capacity / 400) * 100, 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [site.capacity]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const mutation = useMutation({
    mutationFn: async (updatedName: string) => {
      return api.put<Site>(`/api/sites/${site.id}`, { name: updatedName });
    },
    // Optimistic Update Logic
    onMutate: async (updatedName) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['sites'] });

      // Snapshot the previous value
      const previousSites = queryClient.getQueryData(['sites']);

      // Optimistically update to the new value
      queryClient.setQueryData(['sites'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          sites: old.sites.map((s: Site) => 
            s.id === site.id ? { ...s, name: updatedName } : s
          ),
        };
      });

      // Return a context object with the snapshotted value
      return { previousSites };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, _updatedName, context) => {
      console.error('Update failed:', err);
      showToast(`Failed to update ${site.name}`, 'error');
      if (context?.previousSites) {
        queryClient.setQueryData(['sites'], context.previousSites);
      }
      setNewName(site.name);
    },
    onSuccess: (data) => {
      showToast(`Site renamed to ${data.name}`, 'success');
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    if (newName.trim() === '' || newName === site.name) {
      setIsEditing(false);
      setNewName(site.name);
      return;
    }
    mutation.mutate(newName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setNewName(site.name);
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 hover:border-primary-400/50 dark:hover:border-primary-500/50 transition-all duration-300 ease-out cursor-pointer relative overflow-hidden">
      {mutation.isPending && (
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border border-primary-500 rounded px-2 py-0.5 w-full focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <button onClick={handleSave} className="p-1 hover:bg-green-50 dark:hover:bg-green-900/30 rounded text-green-600 transition-colors cursor-pointer">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => { setIsEditing(false); setNewName(site.name); }} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-600 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group/title min-w-0">
              <h3 
                className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors truncate"
                title={site.name}
              >
                {site.name}
              </h3>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                className="opacity-0 group-hover/title:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all text-slate-400 flex-shrink-0 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Active</span>
          </div>
        </div>
        <div className="p-2 bg-primary-50 dark:bg-primary-950/30 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors ml-4">
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
