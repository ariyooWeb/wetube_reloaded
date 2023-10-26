import mongoose from "mongoose"

const videoSchema = new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    fileUrl: {type:String, required: true},
    description:{type:String,required:true,trim:true},
    createdAt:{type:Date,required:true,default:Date.now},
    hashtags:[{type:String,trim:true}], 
    meta:{
        views:{type:Number,default:0},
    },
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    comments : [{type: mongoose.Schema.Types.ObjectId, ref: "comment"}]
});

videoSchema.static('formatHashtags',function(hashtags){
    return hashtags.split(",").map((word)=>word.startsWith("#") ? word : `#${word}`)
})

videoSchema.pre("save",async function(){
    this.hashtags = this.hashtags[0]
    .split(',')
    .map((word)=>(word.startsWith('#') ? word : `#${word}`))
})

const Video  = mongoose.model("video", videoSchema);
export default Video ;