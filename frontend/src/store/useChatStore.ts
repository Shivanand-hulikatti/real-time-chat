import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";


type chatStoreType = {
    messages : string[],
    users : string[],
    selectedUser : any,
    isUserLoading : boolean,
    isMessagesLoading : boolean,
    getUsers : ()=>void,
    sendMessage : (messageData : {selectedUser:any,messages : string[]})=>void,
    subscribeToMessages : ()=>void,
    unsubscribeFromMessages : ()=>void,
    setSelectedUser : (selectedUser:any)=>void,
}

export const useChatStore = create<chatStoreType>((set,get)=>({
    messages : [],
    users : [],
    selectedUser : null,
    isUserLoading : false ,
    isMessagesLoading : false,

    getUsers : async ()=>{
        set({isUserLoading:true});
        try {
            const res = await axiosInstance.get<any>('/messages/users');
            set({users : res.data});
        } catch (error) {
            toast.error("Error fetching users");
        } finally{
            set({isUserLoading:false});
        }
    },

    sendMessage : async (messageData : {selectedUser:any,messages : string[]})=>{
        const { selectedUser, messages } = messageData;
        try {
            const res = await axiosInstance.post<any>(`/messages/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data]});
        } catch (error) {
            toast.error("Error sending message");
        }
    },

    subscribeToMessages : () =>{
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket?.on("newMessage",(newMessage:any)=>{
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageSentFromSelectedUser) return;

            set({messages:[...get().messages, newMessage]});
        })
    },

    unsubscribeFromMessages : () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    },

    setSelectedUser : (selectedUser:any) => set({selectedUser})
}))