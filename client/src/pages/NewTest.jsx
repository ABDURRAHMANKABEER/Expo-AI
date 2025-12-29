import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTest } from "../services/testService";

export default function NewTest() {
  const [title, setTitle] = useState("");
  const [examType, setExamType] = useState("");
  const [organization, setOrganization] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const submit = async () => {
    if (!title.trim()) return alert("Please provide a title for the test.");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("examType", examType);
      formData.append("organization", organization);
      formData.append("subject", subject);
      formData.append("description", description);
      formData.append("additionalInfo", additionalInfo);
      formData.append("numQuestions", numQuestions);

      // append files (ensure your backend expects field name "attachments")
      for (let f of files) formData.append("attachments", f);

      const res = await createTest(formData);
      const id = res?.test?._id;
      if (!id) throw new Error("Server didn't return test id");
      nav(`/test/generate/${id}`);
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  // explicit control classes using your CSS tokens so dark mode text is correct
  const controlClass =
    "w-full p-3 rounded-lg border transition focus:outline-none " +
    "bg-[var(--bg)] text-[var(--text)] border-gray-200 dark:border-slate-700 " +
    "placeholder-gray-400 dark:placeholder-gray-500";

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Test</h1>

      <div className="bg-[var(--surface)] p-6 rounded-xl shadow border border-white/10 flex flex-col gap-4">

        <div>
          <label className="block mb-1 font-medium text-[var(--text)]">Title</label>
          <input
            aria-label="Test title"
            className={controlClass}
            placeholder="Test title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-[var(--text)]">Exam Type</label>
            <input
              aria-label="Exam type"
              className={controlClass}
              placeholder="E.g. Aptitude, Scholarship"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-[var(--text)]">Organization</label>
            <input
              aria-label="Organization"
              className={controlClass}
              placeholder="E.g. Shell, NLNG, MTN"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-[var(--text)]">Subject</label>
          <input
            aria-label="Subject"
            className={controlClass}
            placeholder="E.g. Mathematics, Verbal Reasoning"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[var(--text)]">Description</label>
          <textarea
            aria-label="Description"
            className={`${controlClass} h-24 resize-y`}
            placeholder="Brief description of the test"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[var(--text)]">Additional Info</label>
          <textarea
            aria-label="Additional information"
            className={`${controlClass} h-24 resize-y`}
            placeholder="Anything specific the AI should know"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[var(--text)]">Number of Questions</label>
          <input
            aria-label="Number of questions"
            type="number"
            min={1}
            className={controlClass}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-[var(--text)]">Upload Files (Optional)</label>
          <input
            aria-label="Attachments"
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="text-sm text-[var(--text)]/80"
          />
          {files.length > 0 && (
            <div className="mt-2 text-sm text-[var(--text)]/80">
              Selected: {files.map((f) => f.name).join(", ")}
            </div>
          )}
        </div>

        <button
          className="mt-4 rounded-xl text-white font-semibold py-3 bg-gradient-to-r from-primary-light to-accent hover:opacity-95 transition"
          onClick={submit}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Creating..." : "Create Test & Continue →"}
        </button>
      </div>
    </div>
  );
}