import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { Socket, io } from "socket.io-client";
import { toast } from "react-hot-toast";

type Store = {
    authUser: any;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;
    onlineUsers: any[];
    socket: Socket | null;
    checkAuth: () => Promise<void>;
    connectSocket: () => void;
    disconnectSocket: () => void;
    signup: (data: { fullName: string; email: string; password: string }) => Promise<void>;
    login: (data: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: { profilePic: string }) => Promise<void>;
};

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create<Store>((set,get)=>({
    authUser : null,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,
    isCheckingAuth : true,
    onlineUsers : [],
    socket : null,

    checkAuth : async () =>{
        try {
            const res = await axiosInstance.get<any>('/auth/check');

            set({authUser : res.data?.user})
            get().connectSocket();
        } catch (error) {
            console.log("Error checking auth:", error);
            set({authUser : null});
        } finally{
            set({isCheckingAuth : false});
        }
    },

    connectSocket : () =>{
        const { authUser } = get();

        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query:{
                userId : authUser._id,
            }
        })

        socket.connect();
        set({ socket:socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket : () => {
        if(get().socket?.connected) get().socket?.disconnect()
    },

    signup : async (data: { fullName : string; email: string; password: string }) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post<any>('/auth/signup', data);
            set({ authUser: res.data });
            toast.success("Account created successful!y!!");
            get().connectSocket();
        } catch (error) {
            console.error("Error signing up:", error);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login : async (data: { email: string; password: string }) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post<any>('/auth/login', data);
            set({ authUser: res.data });
            toast.success("Logged in successfully!!");
            get().connectSocket();
        } catch (error) {
            console.error("Error logging in:", error);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout : async () =>{
        try {
            await axiosInstance.get('/auth/logout');
            set({ authUser: null, onlineUsers: [] });
            get().disconnectSocket();
            toast.success("Logged out successfully!!");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    },

    updateProfile : async (data : { profilePic : string})=>{
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put<any>('/auth/updateProfile', data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully!!");
        } catch (error : any) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally{
            set({ isUpdatingProfile: false });
        }
    }

}));