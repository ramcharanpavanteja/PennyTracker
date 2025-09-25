import User from '../models/Users.js';

export const uploadProfileImage = async(req,res)=>{
    try{
        if(!req.file) {
            console.log("File info:", req.file);
            return res.status(400).json({msg:"No file uploaded"});
        }
        const updateUser = await User.findByIdAndUpdate(req.user.id,
            {
                profileImage:{
                        data: req.file.buffer,         
                        contentType: req.file.mimetype,
                    }
            },
            {new:true});
        res.json({ msg: "Profile image uploaded successfully", user: updateUser });
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}