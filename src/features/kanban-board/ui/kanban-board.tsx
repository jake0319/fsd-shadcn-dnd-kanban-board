"use client";
import React, { useEffect, useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";

export default function KanbanBoard() {
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
	const [mount, setMount] = useState(false);

	useEffect(() => setMount(true), []);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			setTasks(tasks => {
				const oldIndex = tasks.findIndex(task => task.id === active.id);
				const newIndex = tasks.findIndex(task => task.id === over?.id);

				return arrayMove(tasks, oldIndex, newIndex);
			});
		}
	}

	return (
		mount && (
			<div className="w-full h-full">
				<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<div className="p-4">
						<SortableContext items={tasks} strategy={verticalListSortingStrategy}>
							{tasks.map(task => (
								<SortableItem key={task.id} task={task} />
							))}
						</SortableContext>
					</div>
				</DndContext>
			</div>
		)
	);
}

interface Task {
	id: string;
	content: string;
}

function SortableItem({ task }: { task: Task }) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

	const style = {
		transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-4 mb-2 bg-white rounded shadow border border-solid border-gray-600">
			<CardComponent task={task}></CardComponent>
		</div>
	);
}

const initialTasks: Task[] = [
	{
		id: "task1",
		content: "sortalbe item1",
	},
	{
		id: "task2",
		content: "sortalbe item2",
	},
	{
		id: "task3",
		content: "sortalbe item3",
	},
];

export function CardComponent({ task }: { task: Task }) {
	return (
		<Card className="w-[300px]">
			<CardHeader>
				<CardTitle>{task.content}</CardTitle>
				<CardDescription>Deploy your new project in one-click.</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5"></div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-between"></CardFooter>
		</Card>
	);
}
