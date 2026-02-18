import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot } from "lexical";
import { usePostStore } from "../../store/postStore";

export default function EditorOnChange() {
    const [editor] = useLexicalComposerContext();

    const setEditorJson = usePostStore((state) => state.setEditorJson);
    const setEditorText = usePostStore((state) => state.setEditorText);

    return (
        <OnChangePlugin
            onChange={(editorState) => {
                editorState.read(() => {
                    const json = editorState.toJSON();
                    const text = $getRoot().getTextContent();

                    setEditorJson(json);
                    setEditorText(text);
                });
            }}
        />
    );
}
