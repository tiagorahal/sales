import { useState } from "react";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);

  // Handles changes to the file input field
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handles form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        console.log(result);
        // Do something with the file content here
      };
      reader.readAsText(file);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="file-input">
        Choose a TXT file to upload:
        <input
          type="file"
          id="file-input"
          accept=".txt"
          onChange={handleFileChange}
        />
      </label>
      <button type="submit">Upload</button>
    </form>
  );
};

export default Upload;