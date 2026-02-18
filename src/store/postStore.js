import { create } from "zustand";
import { fetchPosts, createPost, fetchPostById, updatePost } from "../api/postsApi";

export const usePostStore = create((set, get) => ({
    drafts: [],
    activePost: null,

    editorJson: {},
    editorText: "",

    loading: false,
    isSaving: false,
    lastSavedAt: null,

    loadDrafts: async () => {
        set({ loading: true });

        try {
            const posts = await fetchPosts();
            set({ drafts: posts, loading: false });

            if (posts.length > 0 && !get().activePost) {
                get().setActivePost(posts[0]._id);
            }
        } catch (err) {
            console.error(err);
            set({ loading: false });
        }
    },

    createNewDraft: async () => {
        try {
            const newPost = await createPost("Untitled Draft");
            set((state) => ({
                drafts: [newPost, ...state.drafts],
            }));

            get().setActivePost(newPost._id);
        } catch (err) {
            console.error(err);
        }
    },

    setActivePost: async (id) => {
        set({ loading: true });

        try {
            const post = await fetchPostById(id);

            set({
                activePost: post,
                editorJson: post.content || {},
                loading: false,
            });
        } catch (err) {
            console.error(err);
            set({ loading: false });
        }
    },

    setEditorJson: (json) => set({ editorJson: json }),
    setEditorText: (text) => set({ editorText: text }),

    saveDraft: async () => {
        const post = get().activePost;
        if (!post) return;

        set({ isSaving: true });

        try {
            await updatePost(post._id, {
                content: get().editorJson,
                status: "draft",
            });

            set({
                isSaving: false,
                lastSavedAt: new Date().toLocaleTimeString(),
            });
        } catch (err) {
            console.error(err);
            set({ isSaving: false });
        }
    },

    publishDraft: async () => {
        const post = get().activePost;
        if (!post) return;

        try {
            await updatePost(post._id, { status: "published" });
            alert("Post Published!");
            get().loadDrafts();
        } catch (err) {
            console.error(err);
            alert("Publish failed");
        }
    },
}));
