import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    description: { type: String },
    examType: { type: String }, // UTME, WAEC, Scholarship, Job Aptitude etc.
    organization: { type: String }, // Shell, PTDF, Access Bank, Chevron...
    subject: { type: String }, // Math, English, General Test, etc.

    additionalInfo: { type: String }, // Any extra user text for better AI generation

    attachment: {
      fileType: { type: String }, // image/pdf
      fileUrl: { type: String },  // cloudinary link
    },

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