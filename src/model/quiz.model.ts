import mongoose from "mongoose";

export enum QuizCategory {
  IT = "IT",
  AUTOMOBILES = "Automobiles",
  SCIENCE = "Science",
  HISTORY = "History",
  GEOGRAPHY = "Geography",
  SPORTS = "Sports",
  ENTERTAINMENT = "Entertainment",
  GENERAL_KNOWLEDGE = "General Knowledge",
}

export enum QuizType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

const optionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    option: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  options: {
    type: [optionSchema],
    required: true,
    validate: {
      validator: (options: string[]) =>
        options.length >= 2 && options.length <= 4,
      message: "A question must have atleast 2 options",
    },
  },
  correctAnswer: { type: String, required: true, trim: true },
  timeLimit: { type: Number, default: 15, min: 5, max: 60 },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: Object.values(QuizCategory),
      required: true,
    },
    quizType: {
      type: String,
      enum: Object.values(QuizType),
      default: QuizType.PUBLIC,
      required: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: (question: unknown[]) => question.length > 0,
        message: "A quiz must have atleast one question",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Quiz = mongoose.model("quiz", quizSchema);
