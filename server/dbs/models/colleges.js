import mongoose from 'mongoose'
const Schema = mongoose.Schema
const College = new Schema({
  college: {
    type: String,
    require: true
  },
  city: {
    type: String,
    require: true
  },
  location: {
    type: String,
    require: false
  }
})

export default mongoose.model('College', College)
