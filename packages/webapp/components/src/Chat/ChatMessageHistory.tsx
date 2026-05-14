import { CheckIconSVG, PencilSvg } from "@zauru-sdk/icons";
import { useState, useEffect, useRef } from "react";

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

export const ChatMessageHistory = (props: Props) => {
  const {
    author,
    content,
    onLike,
    onUpdateComment,
    id,
    commentOwner = false,
    date,
    imageLink,
  } = props;

  const initials = author ? author[0].toUpperCase() : "A";
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(content);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [shouldPulse, setShouldPulse] = useState(false);

  useEffect(() => {
    if (isUpdating && textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      textAreaRef.current.focus();
    }
  }, [isUpdating]);

  // Efecto secundario que se ejecuta cada vez que 'isUpdating' cambia
  useEffect(() => {
    // Activar la animación
    setShouldPulse(true);

    // Establecer un temporizador para eliminar la clase después de que la animación se haya completado
    const timer = setTimeout(() => {
      setShouldPulse(false);
    }, 15000); // Tiempo total de la animación

    // Limpiar el temporizador si el componente se desmonta o si 'isUpdating' cambia de nuevo antes de que la animación se complete
    return () => clearTimeout(timer);
  }, [isUpdating]);

  const handleUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 254) {
      setUpdatedContent(e.target.value);
    }
  };

  const handleUpdateClick = () => {
    if (isUpdating) {
      if (textAreaRef.current) {
        textAreaRef.current.blur();
      }
      //onUpdateComment && onUpdateComment(updatedContent, itsNew);
    }
    setIsUpdating(!isUpdating);
  };

  return (
    <div className="p-1 rounded-xl flex items-center space-x-4 relative">
      {commentOwner && (
        <div className="absolute top-2 right-2">
          <button
            onClick={handleUpdateClick}
            className={`${shouldPulse ? "animate-custom-pulse" : ""}`}
          >
            {isUpdating ? <CheckIconSVG /> : <PencilSvg />}
          </button>
        </div>
      )}
      <div
        className={`w-[0%] lg:w-[8%] h-16 bg-purple-300 rounded-full flex items-center justify-center overflow-hidden text-white text-xl font-bold`}
      >
        {initials}
      </div>
      <div className="flex flex-col justify-between h-full w-[92%]">
        <div>
          <div className="flex flex-row space-x-2">
            <div className="text-xl font-medium text-black">{author}</div>
            <div className="text-xl font-medium text-gray-500">
              {date && <> - {date}</>}
            </div>
          </div>
          {isUpdating ? (
            <textarea
              ref={textAreaRef}
              className="bg-gray-100 rounded p-2 w-full resize-none"
              value={updatedContent}
              onChange={handleUpdate}
              maxLength={254}
              placeholder="Deja tus buenos deseos..."
            />
          ) : (
            <p className="text-gray-500">{updatedContent}</p>
          )}
        </div>
        <div className="flex justify-end items-center">
          <button onClick={() => {}}>
            <></>
          </button>
        </div>
      </div>
      {imageLink && (
        <div
          className={`w-[25%] flex items-center justify-center overflow-hidden text-white text-xl font-bold`}
        >
          <div
            onClick={() => {
              return window.open(imageLink, "_blank");
            }}
          >
            <img
              src={imageLink}
              alt={"IMG_CHAT"}
              className={`h-48 w-48 inline mr-1 pb-1`}
              style={{
                stroke: "currentColor",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                fill: "none",
                backgroundColor: "transparent",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
