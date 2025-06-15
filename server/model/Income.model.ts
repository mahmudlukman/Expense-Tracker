import mongoose, { Document, Model, Schema } from "mongoose";

export interface IIncome extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  amount: number;
  source: string;
  icon: string;
  date: Date;
}

const IncomeSchema: Schema<IIncome> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Income: Model<IIncome> = mongoose.model("Income", IncomeSchema);
export default Income;
