'use client';
import { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useStatuses, useTasks } from '@/hooks/use-tasks';
import { KanbanColumn } from './kanban-column';
import type { ApiStatus, TaskQuery } from '@/lib/api/tasks';

export function KanbanBoard({ query, projectId, canCreateTask = true }: { query: TaskQuery; projectId?: string; canCreateTask?: boolean }) {
  const { data: statuses, isLoading: statusesLoading } = useStatuses();
  const { data: tasks, isLoading: tasksLoading } = useTasks(query);

  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!statuses?.length) return;
    setOrderedIds((prev) => {
      const known = new Set(statuses.map((s) => s.id));
      const kept = prev.filter((id) => known.has(id));
      const missing = statuses.map((s) => s.id).filter((id) => !kept.includes(id));
      return kept.length + missing.length === statuses.length ? [...kept, ...missing] : prev;
    });
  }, [statuses]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  if (statusesLoading || tasksLoading) return <div className="p-6 text-sm text-ink-500">Loading board...</div>;
  if (!statuses?.length) return <div className="p-6 text-sm text-ink-500">No statuses configured for this workspace.</div>;

  const statusById = new Map(statuses.map((s) => [s.id, s]));
  const orderedStatuses = orderedIds.map((id) => statusById.get(id)).filter((s): s is ApiStatus => !!s);
  const activeStatus = activeId ? statusById.get(activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    setOrderedIds((prev) => {
      const oldIndex = prev.indexOf(String(active.id));
      const newIndex = prev.indexOf(String(over.id));
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={orderedIds} strategy={horizontalListSortingStrategy} >
        <div className="flex gap-4 w-full overflow-x-auto p-6 pt-0 md:overflow-x-visible">
          {orderedStatuses.map((status) => (
            <KanbanColumn
              key={status.id}
              status={status}
              projectId={projectId}
              canCreateTask={canCreateTask}
              tasks={(tasks ?? []).filter((t) => t.status.name === status.name)}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeStatus ? (
          <KanbanColumn
            status={activeStatus}
            projectId={projectId}
            canCreateTask={canCreateTask}
            tasks={(tasks ?? []).filter((t) => t.status.name === activeStatus.name)}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}