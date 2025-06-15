import mongoose, { Document, Model, Schema } from "mongoose";

interface IExpense extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  amount: number;
  category: string;
  icon: string;
  date: Date;
}

const ExpenseSchema: Schema<IExpense> = new mongoose.Schema(
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
    category: {
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

const Expense: Model<IExpense> = mongoose.model("Expense", ExpenseSchema);
export default Expense;
