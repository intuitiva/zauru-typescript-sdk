type Props = {
    author: string;
    content: string;
    date?: string;
    onLike?: (like: boolean) => void;
    onUpdateComment?: (text: string, itsNew?: boolean) => void;
    id: string;
    commentOwner?: boolean;
    imageLink?: string;
};
export declare const ChatMessageHistory: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
