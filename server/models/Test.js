import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    examType: { type: String }, 
    organization: { type: String },
    subject: { type: String },

    additionalInfo: { type: String },

    // Support multiple images/PDFs
    attachments: [
      {
        fileType: { type: String },  // "image", "pdf"
        fileUrl: { type: String },   // cloudinary URL
      }
    ],

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      }
    ],
  },
  { timestamps: true }
);

export const Test = mongoose.model("Test", testSchema);
