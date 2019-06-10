import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const Image = new Schema({
  username:{
    type: String,
    require: true
  },
  guide:{
    type: String
  },
  cover:{
    type:String
  },
  type:{
    type:String,
    require:true
  }
})

export default mongoose.model('Image', Image)
