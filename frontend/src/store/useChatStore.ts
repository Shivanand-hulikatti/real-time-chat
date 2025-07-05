import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";


type chatStoreType = {
    messages : string[],
    users : string[],
    selectedUser : any,
    isUsersLoading : boolean,
    isMessagesLoading : boolean,
    getUsers : ()=>void,
    getMessages : (userId : string)=>void,
    sendMessage : (messageData : {selectedUser:any,messages : string[]})=>void,
    subscribeToMessages : ()=>void,
    unsubscribeFromMessages : ()=>void,
    setSelectedUser : (selectedUser:any)=>void,
}

export const useChatStore = create<chatStoreType>((set,get)=>({
    messages : [],
    users : [],
    selectedUser : null,
    isUsersLoading : false ,
    isMessagesLoading : false,

    getUsers : async ()=>{
        set({isUsersLoading:true});
        try {
            const res = await axiosInstance.get<any>('/messages/users');
            set({users : res.data});
        } catch (error) {
            toast.error("Error fetching users");
        } finally{
            set({isUsersLoading:false});
        }
    },

    getMessages : async (userId : string)=>{
        set({isMessagesLoading:true});
        try {
            const res = await axiosInstance.get<any>(`/messages/${userId}`);
            set({messages : res.data});
        } catch (error) {
            toast.error("Error fetching messages");
        } finally{
            set({isMessagesLoading:false});
        }
    },

    sendMessage : async (messageData : {selectedUser:any,messages : string[]})=>{
        const { selectedUser, messages } = get();
        try {
            // console.log(messageData);
            
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