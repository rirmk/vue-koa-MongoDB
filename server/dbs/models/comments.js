import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const CommentSchema = new Schema({
  clusterId: {
    type: String,
    require: true
  },
  comment: {
    type: String,
    require: true
  },
  username:{
    type: String,
    require: true
  }
})

export default mongoose.model('Comment', CommentSchema)
