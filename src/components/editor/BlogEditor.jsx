import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { HeadingNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";

import Toolbar from "./ToolBar";
import EditorOnChange from "./EditorOnChange";

import { usePostStore } from "../../store/postStore";

export default function BlogEditor() {
    const editorJson = usePostStore((state) => state.editorJson);

    const initialConfig = {
        namespace: "SmartBlogEditor",
        theme: {
            paragraph: "mb-2",
        },
        nodes: [HeadingNode, ListNode, ListItemNode],

        editorState: (editor) => {
            if (editorJson && Object.keys(editorJson).length > 0) {
                try {
                    const parsedState = editor.parseEditorState(
                        JSON.stringify(editorJson)
                    );
                    editor.setEditorState(parsedState);
                } catch (err) {
                    console.error("Error loading editor state:", err);
                }
            }
        },

        onError(error) {
            console.error(error);
        },
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <Toolbar />

            <div className="min-h-[400px] p-4">
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable className="outline-none min-h-[400px] text-gray-800 text-base leading-relaxed" />
                    }
                    placeholder={<p className="text-gray-400">Start writing...</p>}
                    ErrorBoundary={LexicalErrorBoundary}
                />

                <HistoryPlugin />
                <ListPlugin />
                <EditorOnChange />
            </div>
        </LexicalComposer>
    );
}
