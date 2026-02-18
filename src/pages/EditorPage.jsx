import { useEffect, useState } from "react";
import { usePostStore } from "../store/postStore";
import { useAutoSave } from "../hooks/useAutoSave";
import BlogEditor from "../components/editor/BlogEditor";
import { generateSummary } from "../api/aiApi";

import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function EditorPage() {
    const drafts = usePostStore((state) => state.drafts);
    const activePost = usePostStore((state) => state.activePost);
    const loading = usePostStore((state) => state.loading);

    const isSaving = usePostStore((state) => state.isSaving);
    const lastSavedAt = usePostStore((state) => state.lastSavedAt);

    const loadDrafts = usePostStore((state) => state.loadDrafts);
    const createNewDraft = usePostStore((state) => state.createNewDraft);
    const setActivePost = usePostStore((state) => state.setActivePost);
    const publishDraft = usePostStore((state) => state.publishDraft);

    const editorText = usePostStore((state) => state.editorText);

    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);

    const navigate = useNavigate();

    const [summary, setSummary] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    useAutoSave();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadDrafts();
    }, [token]);

    async function handleGenerateSummary() {
        try {
            setAiLoading(true);
            setSummary("");

            const data = await generateSummary(editorText);
            setSummary(data.summary);

            setAiLoading(false);
        } catch (err) {
            console.error("AI summary error:", err);
            alert("Failed to generate summary");
            setAiLoading(false);
        }
    }

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <div className="h-screen flex bg-gray-50 text-gray-900">
            {/* Sidebar */}
            <aside className="w-72 border-r border-gray-200 bg-white p-4">
                <h2 className="text-lg font-semibold">Drafts</h2>

                <button
                    onClick={createNewDraft}
                    className="mt-4 w-full rounded-lg bg-black text-white py-2 text-sm font-medium hover:bg-gray-800"
                >
                    + New Draft
                </button>

                <div className="mt-6 space-y-3">
                    {loading && (
                        <p className="text-sm text-gray-500">Loading drafts...</p>
                    )}

                    {!loading && drafts.length === 0 && (
                        <p className="text-sm text-gray-500">
                            No drafts yet. Create one.
                        </p>
                    )}

                    {drafts.map((draft) => (
                        <div
                            key={draft._id}
                            onClick={() => setActivePost(draft._id)}
                            className={`p-3 rounded-lg border cursor-pointer transition ${activePost?._id === draft._id
                                ? "border-black bg-gray-50"
                                : "border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            <p className="font-medium text-sm">{draft.title}</p>

                            <p className="text-xs text-gray-500 mt-1">
                                Status: {draft.status}
                            </p>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Editor Area */}
            <main className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
                    <h1 className="font-semibold text-gray-800">
                        {activePost?.title || "No Draft Selected"}
                    </h1>

                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">
                            {isSaving
                                ? "Saving..."
                                : lastSavedAt
                                    ? `Saved at ${lastSavedAt}`
                                    : "Not saved"}
                        </span>

                        <button
                            onClick={handleGenerateSummary}
                            disabled={aiLoading || !activePost}
                            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                        >
                            {aiLoading ? "Generating..." : "Generate Summary"}
                        </button>

                        <button
                            onClick={publishDraft}
                            disabled={!activePost}
                            className="px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            Publish
                        </button>

                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Editor Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 min-h-[500px]">
                            {activePost ? (
                                <BlogEditor key={activePost._id} />
                            ) : (
                                <p className="text-gray-400">
                                    Select a draft to start editing.
                                </p>
                            )}
                        </div>

                        {/* AI Summary Box */}
                        {summary && (
                            <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                                <h2 className="font-semibold mb-2">AI Summary</h2>
                                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                                    {summary}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
