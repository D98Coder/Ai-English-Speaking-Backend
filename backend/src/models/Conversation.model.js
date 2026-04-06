import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  context: {
    type: Object,
    default: {}
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

conversationSchema.methods.updateLastMessage = function() {
  this.lastMessageAt = new Date();
  return this.save();
};

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;