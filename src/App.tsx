import { useState } from "react";
import axios from "axios";

const API_KEY = "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";

const ResumeGenerator = () => {
  const [resume, setResume] = useState("");
  const [userType, setUserType] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [error, setError] = useState("");

  const generateResume = async () => {
    let prompt = "";

    switch (userType) {
      case "student":
        prompt = "Generate complete resume for a student.";
        break;
      case "fresher":
        prompt = "Generate complete resume for a fresher.";
        break;
      case "experienced":
        prompt = `Write your experienced resume prompt here for ${yearsOfExperience} years of experience.`;
        break;
      default:
        return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };

    const data = {
      prompt: prompt,
      max_tokens: 120,
      temperature: 0.7,
      model: "text-davinci-003",
      n: 1,
    };

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        data,
        { headers }
      );

      setResume(response.data.choices[0].text.trim());
      setError("");
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        setError("Too many requests. Please try again later.");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-8 mx-2 sm:mx-4 md:mx-8 lg:mx-12 xl:mx-16 2xl:mx-20 flex-grow">
        <h2 className="text-2xl font-bold flex justify-center items-center mb-4">
          <img
            src="./logo.png"
            alt="logo"
            className="h-8 inline-block align-middle mr-2"
          />
          Prompt Resume
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Generate professional resumes in minutes.
        </p>
        <label className="block mb-4">
          Select User Type:
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="student">Student</option>
            <option value="fresher">Fresher</option>
            <option value="experienced">Experienced</option>
          </select>
          {userType === "experienced" && (
            <label className="block mt-1 mb-4">
              Years of Experience:
              <input
                type="number"
                inputMode="numeric"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(parseInt(e.target.value))}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          )}
        </label>
        <button
          onClick={generateResume}
          disabled={!userType}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
        >
          Generate Resume
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <pre className="mt-8 border border-gray-300 bg-slate-100 p-4 rounded-md text-sm overflow-x-auto">
          {resume}
        </pre>
      </div>
      <footer className="text-center my-4 text-gray-500">
        © 2023 AbhiVarde - Made with ❤️ for the people of the internet.
      </footer>
    </div>
  );
};

export default ResumeGenerator;
