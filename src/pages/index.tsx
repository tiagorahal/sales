import { useState } from "react";
export default function Home() {
  const [text, setText] = useState<string[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const lines = reader.result.split("\n");
          setText(lines);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      <ul>
        {text &&
          text.map((line, index) => {
            return <li key={index}>{line}</li>;
          })}
      </ul>
    </div>
  );
}