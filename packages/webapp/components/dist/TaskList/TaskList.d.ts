export type TaskType = {
    title: string;
    description?: string;
    status: "waiting" | "processing" | "done" | "error";
};
type TaskProps = {
    task: TaskType;
};
export declare const Task: ({ task }: TaskProps) => import("react/jsx-runtime").JSX.Element;
type TaskModalProps = {
    tasks: TaskType[];
};
export declare const TaskList: ({ tasks }: TaskModalProps) => import("react/jsx-runtime").JSX.Element;
export {};
