import Project from "../models/Project.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

//get all projects

const getAllProjects=asyncHandler(async(req,res)=>{
    const filter={};

    const statusParams=req.query.status || "open";
    if(statusParams!=="all"){
        const allowedStatuses=["open","closed","completed"];
        if(!allowedStatuses.includes(statusParams)){
            throw new ApiError(
                400,
                "Status must be one of : Open,Closed,Completed, or 'all' to see everything"
            );

        }
        filter.status=statusParams;
    }

    if(req.query.domain){
        filter.domain=req.status.domain.trim();
    }

    if(req.query.search){
        const regex=new RegExp(req.query.search,"i");
        filter.$or=[
            {title:regex},
            {description:regex}
        ];
    }

    const projects=await Project.find(filter)
        .populate("createdBy","name email department designation")
        .sort({createdAt:-1});

    res.status(200).json({
        success:true,
        count:projects.length,
        data:projects
    });
});

//get project by id
const getProjectById=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const project=await Project.findById(id)
        .populate("createdBy","name email department designation");
    
        if(!project){
            throw new ApiError(404,"Project Not Found");
        }

        res.status(200).json({
            success:true,
            data:project
        });

});

export {
    getAllProjects,
    getProjectById
}
