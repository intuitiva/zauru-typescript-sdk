import React, { useState } from "react";

export type TaskType = {
  title: string;
  description?: string;
  status: "waiting" | "processing" | "done" | "error";
};

type TaskProps = {
  task: TaskType;
};

export const Task = ({ task }: TaskProps) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  let statusIcon;
  let taskStyle = {};
  let bgColor;

  switch (task.status) {
    case "waiting":
      statusIcon = "🕗"; // Icono de reloj (como un ejemplo, puedes reemplazarlo con un ícono o SVG real)
      taskStyle = { opacity: 0.5 }; // estilo disabled
      bgColor = "bg-gray-200"; // Color de fondo gris
      break;
    case "processing":
      statusIcon = "⏳"; // Icono de reloj de arena
      taskStyle = { fontWeight: "bold" }; // estilo negrita
      bgColor = "bg-blue-200"; // Color de fondo azul
      break;
    case "done":
      statusIcon = "✅"; // Icono de check
      bgColor = "bg-green-200"; // Color de fondo verde
      break;
    case "error":
      statusIcon = "❌"; // Icono de cruz
      taskStyle = { color: "red" }; // estilo color rojo
      bgColor = "bg-red-200"; // Color de fondo rojo
      break;
  }

  return (
    <div
      style={taskStyle}
      className={`${bgColor} rounded-lg p-3 mb-3 ${
        task.description ? "cursor-pointer" : ""
      }`}
      onClick={() =>
        task.description && setIsDescriptionOpen(!isDescriptionOpen)
      }
    >
      <div className="flex justify-between">
        <div>
          {statusIcon} {task.title}{" "}
          {`${task.status === "processing" ? "..." : ""}`}
        </div>
        {task.description && <div>▼</div>}
      </div>
      {task.description && isDescriptionOpen && (
        <div className="mt-2">{task.description}</div>
      )}
    </div>
  );
};

type TaskModalProps = {
  tasks: TaskType[];
};

export const TaskList = ({ tasks }: TaskModalProps) => {
  const completedTasks = tasks.filter(
    (task) => task.status === "done" || task.status === "error"
  ).length;
  const progressPercentage = (completedTasks / tasks.length) * 100;

  return (
    <div>
      {tasks.map((task, index) => (
        <Task key={index} task={task} />
      ))}
      <div className="h-2 bg-gray-200 rounded-lg mt-3">
        <div
          className="bg-green-500 h-full rounded-lg"
          style={{ width: `${progressPercentage}%`, transition: "width 0.5s" }}
        ></div>
      </div>
    </div>
  );
};
