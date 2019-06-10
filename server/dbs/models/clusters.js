import mongoose from 'mongoose'
const Schema = mongoose.Schema
const Cluster = new Schema({
  clusterId:{
    type: String,
    require: true
  },
  title: {
    type: String,
    require: true
  },
  province: {
    type: String,
    require: false
  },
  city: {
    type: String,
    require: true
  },
  type: {
    type: String,
    require: true
  },
  username: {
    type: String,
    require: true
  },
  tel: {
    type: String,
    require: false
  },
  WeChat: {
    type: String,
    require: true
  },
  startTime: {
    type: String,
    require: true
  },
  endTime: {
    type: String,
    require: true
  },
  totals: {
    type: String,
    require: true
  },
  college: {
    type: String,
    require: true
  },
  location: {
    type: String,
    require: true
  },
  actiContent:{
    type: String,
    require: true
  },
  like: {
    type:Array
  },
  cover:{
    type: Object,
    require: true
  },
  guide: {
    type: Object,
    require: true
  },
  member: {
    type: Array,
    require: true
  }
})

export default mongoose.model('Cluster', Cluster)
