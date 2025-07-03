import cloudinary from "../lib/cloudinary";
import { getRecieverSocketId, io } from "../lib/socket";
import Message from "../models/messages.model";
import User from "../models/user.model";


export const getUsersForSidebar = async (req : any, res: any) =>{
    try {
        const loggedInUser = req.user._id;
        const filterdUsers = await User.find({_id : {$ne : loggedInUser}}).select("-password");

        res.status(200).json(filterdUsers);
    } catch (error) {
        console.log("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async (req: any, res: any) => {
    try {
        const {id : userToChatId} = req.params;
        const myId = req.user._id;

        const messages  = await Message.find({
            $or:[
                { senderId : myId, receiverId: userToChatId },
                { senderId : userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error while getting messages" });
    }
}

export const sendMessage = async (req : any, res: any) => {
    try {
        const {text , image} = req.body;
        const { id : recieverId } = req.params;
        const senderId = req.user._id;

        let ImageUrl = "";
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            ImageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: ImageUrl
        })

        const reciverSocketId = getRecieverSocketId(recieverId);
        if(reciverSocketId){
            io.to(reciverSocketId).emit("newMessage",newMessage);
        }

        await newMessage.save();

        res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error sending message:", error);
        res.status(500).json({ message: "Internal server error while sending message" });       
    }
}
