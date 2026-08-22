'use client';

import React, { useEffect, useMemo } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ScheduleCard } from './ScheduleCard';
import { ScheduleItem } from '../lib/types';
import { useStore } from '../store/useStore';

interface TimelineProps {
  schedules: ScheduleItem[];
  date: string;
}

export const Timeline = React.memo(function Timeline({ schedules, date }: TimelineProps) {
  const { reorderSchedules } = useStore();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-scroll to active item
  const activeItemId = useMemo(() => {
    const item = schedules.find(s => s.status !== 'Completed');
    return item ? item.id : null;
  }, [schedules]);

  useEffect(() => {
    if (activeItemId) {
      // Small timeout to ensure DOM layout is complete
      const timer = setTimeout(() => {
        const el = document.getElementById(`card-${activeItemId}`);
        if (el) {
          // Calculate offset to scroll smoothly with spacing for header
          const y = el.getBoundingClientRect().top + window.scrollY - 150;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeItemId, date]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // minimum drag distance before taking over
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = schedules.findIndex(s => s.id === active.id);
      const newIndex = schedules.findIndex(s => s.id === over.id);
      
      const newArray = arrayMove(schedules, oldIndex, newIndex);
      
      // Update order in IndexedDB
      const updates = newArray.map((item, index) => ({
        id: item.id,
        order: index
      }));
      
      try {
        const reordered = updates.map(u => {
          const item = newArray.find(a => a.id === u.id);
          if (!item) return null;
          return { ...item, order: u.order };
        }).filter(u => u !== null) as ScheduleItem[];
        
        await reorderSchedules(reordered);
      } catch (err) {
        console.error("Failed to update order", err);
      }
    }
  };

  return (
    <div className="py-4">
      {isMounted ? (
        <DndContext 
          id="timeline-dnd-context"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={schedules.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="relative">
              {schedules.map(item => (
                <ScheduleCard key={item.id} item={item} />
              ))}
              
              {/* Timeline end padding */}
              <div className="h-16" />
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="relative">
          {schedules.map(item => (
            <ScheduleCard key={item.id} item={item} />
          ))}
          <div className="h-16" />
        </div>
      )}
    </div>
  );
});
