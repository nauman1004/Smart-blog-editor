import { useEffect } from "react";
import { usePostStore } from "../store/postStore";

export function useAutoSave() {
    const editorJson = usePostStore((state) => state.editorJson);
    const saveDraft = usePostStore((state) => state.saveDraft);

    useEffect(() => {
        if (!editorJson || Object.keys(editorJson).length === 0) return;

        const timer = setTimeout(() => {
            saveDraft();
        }, 2000);

        return () => clearTimeout(timer);
    }, [editorJson]);
}
