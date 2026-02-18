import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useState } from "react";
import { generateSummary } from "../../api/aiApi";

export default function Toolbar() {
    const [editor] = useLexicalComposerContext();

    const [loading, setLoading] = useState(false);
    const [aiOutput, setAiOutput] = useState("");

    const getEditorText = () => {
        let text = "";
        editor.update(() => {
            text = $getRoot().getTextContent();
        });
        return text;
    };

    const handleSummary = async () => {
        setLoading(true);
        setAiOutput("");

        try {
            const text = getEditorText();
            const data = await generateSummary(text);

            setAiOutput(data.summary);
        } catch (err) {
            alert("Error generating summary");
        }

        setLoading(false);
    };

    return (
        <div className="p-3 border-b flex flex-col gap-3 bg-white rounded-t-xl">
            <div className="flex gap-2">
                <button
                    onClick={handleSummary}
                    disabled={loading}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? "Generating..." : "Generate Summary"}
                </button>
            </div>

            {aiOutput && (
                <div className="p-3 border rounded-lg bg-gray-50 whitespace-pre-wrap text-sm text-gray-700">
                    <b>AI Summary:</b>
                    <br />
                    {aiOutput}
                </div>
            )}
        </div>
    );
}
