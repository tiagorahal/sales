import type { NextPage } from "next";
import React from "react";

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const inputFileRef = React.useRef<HTMLInputElement | null>(null);

  const handleOnClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    /* Prevent form from submitting by default */
    e.preventDefault();

    /* If file is not selected, then show alert message */
    if (!inputFileRef.current?.files?.length) {
      alert("Please, select file you want to upload");
      return;
    }

    setIsLoading(true);

    /* Add files to FormData */
    const formData = new FormData();
    Object.values(inputFileRef.current.files).forEach((file) => {
      formData.append("file", file);
    });

    /* Send request to our api route */
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const body = (await response.json()) as {
      status: "ok" | "fail";
      message: string;
    };

    alert(body.message);

    if (body.status === "ok") {
      inputFileRef.current.value = "";
      // Do some stuff on successfully upload
    } else {
      // Do some stuff on error
    }

    setIsLoading(false);
  };

  return (
    <form className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <input
          type="file"
          name="myfile"
          ref={inputFileRef}
          className="p-2 bg-gray-200 rounded-md"
          multiple
        />
      </div>
      <div className="flex gap-2 justify-center items-center">
        <input
          type="submit"
          value="Upload"
          disabled={isLoading}
          onClick={handleOnClick}
          className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md disabled:opacity-50"
        />
        {isLoading && ` Wait, please...`}
      </div>
    </form>
  );
};

export default Home;
