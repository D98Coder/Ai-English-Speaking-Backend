// Mock tests data
const tests = [
  {
    _id: '1',
    title: 'Basic Grammar Test',
    description: 'Test your basic English grammar skills',
    level: 'basic',
    timeLimit: 30,
    questions: [
      {
        questionText: 'I ___ to school every day.',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 0,
        points: 1
      },
      {
        questionText: 'She ___ playing piano.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 1,
        points: 1
      },
      {
        questionText: 'They ___ watching TV now.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 2,
        points: 1
      },
      {
        questionText: '___ you like ice cream?',
        options: ['Does', 'Do', 'Is', 'Are'],
        correctAnswer: 1,
        points: 1
      },
      {
        questionText: 'He ___ to the park yesterday.',
        options: ['go', 'goes', 'went', 'going'],
        correctAnswer: 2,
        points: 1
      }
    ]
  },
  {
    _id: '2',
    title: 'Intermediate Grammar Test',
    description: 'Test your intermediate English grammar skills',
    level: 'intermediate',
    timeLimit: 30,
    questions: [
      {
        questionText: 'If I ___ you, I would study harder.',
        options: ['was', 'were', 'am', 'is'],
        correctAnswer: 1,
        points: 1
      },
      {
        questionText: 'She ___ already finished her homework.',
        options: ['has', 'have', 'is', 'are'],
        correctAnswer: 0,
        points: 1
      },
      {
        questionText: 'They have been waiting ___ 2 hours.',
        options: ['since', 'for', 'from', 'during'],
        correctAnswer: 1,
        points: 1
      },
      {
        questionText: "I'm looking forward ___ you again.",
        options: ['to see', 'to seeing', 'seeing', 'see'],
        correctAnswer: 1,
        points: 1
      },
      {
        questionText: 'The movie was ___ than I expected.',
        options: ['good', 'well', 'better', 'best'],
        correctAnswer: 2,
        points: 1
      }
    ]
  }
];

const results = [];

export const getTests = async (req, res) => {
  try {
    const userTests = tests.map(test => ({
      ...test,
      questions: test.questions.map(q => ({
        questionText: q.questionText,
        options: q.options,
        points: q.points
      }))
    }));
    
    res.json({ success: true, tests: userTests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTestById = async (req, res) => {
  try {
    const test = tests.find(t => t._id === req.params.testId);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    
    res.json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitTest = async (req, res) => {
  try {
    const { testId, answers, timeSpent } = req.body;
    
    const test = tests.find(t => t._id === testId);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    
    let score = 0;
    const details = [];
    
    answers.forEach(answer => {
      const question = test.questions[answer.questionIndex];
      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) score += question.points;
      
      details.push({
        questionIndex: answer.questionIndex,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0
      });
    });
    
    const totalPoints = test.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (score / totalPoints) * 100;
    
    const result = {
      _id: Date.now().toString(),
      user: req.user._id,
      test: testId,
      score,
      percentage,
      details,
      completedAt: new Date()
    };
    
    results.push(result);
    
    res.json({
      success: true,
      data: {
        score: percentage,
        totalQuestions: test.questions.length,
        correctAnswers: details.filter(d => d.isCorrect).length,
        details
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserResults = async (req, res) => {
  try {
    const userResults = results.filter(r => r.user === req.user._id);
    res.json({ success: true, results: userResults });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
