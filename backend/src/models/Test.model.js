import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  level: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced'],
    required: true
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
      required: true
    },
    explanation: String,
    points: {
      type: Number,
      default: 1
    }
  }],
  totalPoints: {
    type: Number,
    default: 0
  },
  timeLimit: {
    type: Number,
    default: 30
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

testSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
  next();
});

const Test = mongoose.model('Test', testSchema);

export default Test;