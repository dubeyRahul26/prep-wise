import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ApplicationSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  link: { type: String },
  applicationDate: { type: Date, required: true },
  deadline: { type: Date },
  status: { type: String, enum: ['Applied', 'Interviewing', 'Rejected', 'Offer'], default: 'Applied' },
  notes: { type: String, default: '' },
});

export default model('Application', ApplicationSchema);
