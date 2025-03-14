import { create } from "zustand";
import { AdminActions, AdminStates } from "./types";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";


export const useAdminStore = create<AdminStates & AdminActions>((set) => ({
    authAdmin: null,
    isAdminSigninIn: false,
    isAdminCheckingAuth: false,
    isLoggingOut: false,
    posts: [],
    isDeletingPost: false,

    signin: async (data) => {
        set({isAdminSigninIn: true})
        try {
            const res = await axiosInstance.post("/admin/signin", data);
            set({authAdmin: res.data})
            toast.success("Admin Signed In Successfully")
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.msg) {
                toast.error(error.response.data.msg as string);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            set({isAdminSigninIn: false})
        }
    },

    checkAdminAuth: async () => {
        set({isAdminCheckingAuth: true})
        try {
            const res = await axiosInstance.get("/admin/check");
            set({authAdmin: res.data})
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.msg) {
                toast.error(error.response.data.msg as string);
            } else {
                toast.error("An unexpected error occurred.");
            }
            set({authAdmin: null})
        } finally {
            set({isAdminCheckingAuth: false})
        }
    },

    logout: async () => {
        set({isLoggingOut: true})
        try {
            await axiosInstance.post("/admin/logout")
            set({authAdmin: null})

            toast.success("Logged out successfully")
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.msg) {
                toast.error(error.response.data.msg as string);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            set({isLoggingOut: false})
        }
    },

    getPosts: async () => {
        try {
            const res = await axiosInstance.get("/admin/view-posts")
            set({posts: res.data})
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.msg) {
                toast.error(error.response.data.msg as string);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            
        }
    },

    deletePost: async () => {
        try {
            
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.msg) {
                toast.error(error.response.data.msg as string);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            
        }
    },

    deleteComment: async () => {
        try {
            
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.msg) {
                toast.error(error.response.data.msg as string);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            
        }
    }
}))