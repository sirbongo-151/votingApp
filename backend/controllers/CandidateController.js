import mongoose from "mongoose";
import Candidate from "../models/candidateModel.js";
// import cloudinary  from "../config/cloudinary.js"

export const getCandidates = async (req,res)=>{
    try {
        const candidates = await Candidate.find();
        res.status(200).json({success: true, data: candidates});
    } catch (error) {
        res.status(500).json({success:false, message: error.message})
    }
}

export const createCandidate = async (req, res)=>{
    const {name, image, position} = req.body;
    if(!name || !image || !position){
        return res.status(400).json({msg: "Please provide all fields."});
    }

    // const uploadResponse = await cloudinary.uploader.upload(image)
    // const imageUrl = uploadResponse.secure_url

    const newCandidate = await Candidate({
        name,
        image,
        position,
    })
    

    try {
        await newCandidate.save();
        res.status(201).json({success: true, data: newCandidate});
    } catch (error) {
        res.status(500).json({success:false, message: error.message})
    }
    
}

export const updateCandidate = async (req, res) =>{
    const {id} = req.params;
    const candidate = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message:"Invalid candidate id"})
    }

    try {
       const updatedCandidate = await Candidate.findByIdAndUpdate(id, candidate, {new:true}) 
       res.status(200).json({success: true, data:updatedCandidate})
    } catch (error) {
        res.status(500).json({success: false, message: "Server error"})
    }
} 

export const deleteCandidate = async (req, res) =>{
    try {
        const {id} = req.params
       const candidate =  await Candidate.findById(id)
       if(!candidate){
           return res.status(404).json({success:false, msg:"Candidate not found"})
       }

       await Candidate.findByIdAndDelete(id)
        res.status(200).json({success: true, msg:"Candidate deleted"})
    } catch (error) {
        res.status(500).json({success:false, msg:"Candidate not deleted due to server error"})
    }
}

export const addVoteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(
          req.params.id,
          { $inc: { votes: 1 } },
          { new: true }
        );
    
        if (!candidate) {
          return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json(candidate);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}