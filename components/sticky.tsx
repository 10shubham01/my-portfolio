import { motion, PanInfo } from "framer-motion";
import { useEffect, useState } from "react";
import { sendGTMEvent } from "@next/third-parties/google";
interface Note {
  id: number;
  pinned: boolean;
  position: { x: number; y: number };
  value: string;
  placeholder: string;
}

export default function StickyNotesStack() {
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from local storage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem("sticky-notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // Initialize notes if none are found
      setNotes([
        {
          id: 1,
          pinned: false,
          position: { x: 0, y: 0 },
          value: "",
          placeholder: "Confess your genius... or your caffeine addiction.",
        },
        {
          id: 2,
          pinned: false,
          position: { x: 0, y: 0 },
          value: "",
          placeholder: "Plot your next big idea… or your next meal plan!",
        },
        {
          id: 3,
          pinned: false,
          position: { x: 0, y: 0 },
          value: "",
          placeholder: "Say something profound... or just 'Hello, World!'",
        },
      ]);
    }
  }, []);

  // Save notes to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("sticky-notes", JSON.stringify(notes));
  }, [notes]);

  const handleDragEnd = (
    id: number,
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const target = event.target as HTMLElement;
    const noteWidth = target.offsetWidth;
    const noteHeight = target.offsetHeight;

    // Adjust position to center based on note size
    const adjustedX = info.point.x - noteWidth;
    const adjustedY = info.point.y - noteHeight;

    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((note) =>
        note.id === id
          ? { ...note, pinned: true, position: { x: adjustedX, y: adjustedY } }
          : note
      );
      return updatedNotes;
    });
  };

  const handleTextChange = (id: number, value: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, value } : note))
    );
    sendGTMEvent({ event: "noteAdded", value: JSON.stringify(notes) });
  };

  return (
    <div className="relative size-96">
      {notes.map((note, index) => (
        <motion.div
          key={note.id}
          drag
          dragMomentum={false}
          onDragEnd={(event, info) => handleDragEnd(note.id, event, info)}
          initial={{
            x: note.position.x,
            y: note.position.y,
            rotate: index * 5 - 5,
          }}
          animate={{
            rotate: index * 5 - 5,
          }}
          whileDrag={{ scale: 0.9 }}
          className="absolute bg-yellow-500 rounded-3xl p-6 w-80 h-80 shadow-2xl opacity-85"
          style={{ zIndex: notes.length - index }}
        >
          <textarea
            placeholder={note.placeholder}
            value={note.value}
            onChange={(e) => handleTextChange(note.id, e.target.value)}
            className="w-full h-full bg-transparent text-black text-xl resize-none border-none focus:outline-none placeholder:opacity-75 placeholder:text-gray-100 !cursor-grab tracking-widest"
          ></textarea>
          <motion.span className="absolute top-2 right-2 text-white p-2 rounded-full text-3xl">
            {""}
          </motion.span>
        </motion.div>
      ))}
      <div className="absolute -bottom-32  w-full text-2xl tracking-wider text-right -rotate-6">
        Write, drag, and stick your genius… or your grocery list… or just say
        {"Hello, World!"}
        <br />
        —no judgment.
      </div>
    </div>
  );
}
