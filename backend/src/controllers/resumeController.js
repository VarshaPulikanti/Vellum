import { Resume } from "../models/Resume.js";
import { asyncHandler } from "../utils/async.js";

export const listResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id })
    .select("title template accent updatedAt createdAt data.personal.fullName data.targetRole")
    .sort({ updatedAt: -1 });
  res.json({ resumes });
});

export const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) return res.status(404).json({ message: "Resume not found." });
  res.json({ resume });
});

export const createResume = asyncHandler(async (req, res) => {
  const { title, template, accent, data } = req.body;
  const resume = await Resume.create({
    user: req.user._id,
    title: title || data?.personal?.fullName || "Untitled resume",
    template: template || "editorial",
    accent: accent || "#2c4a40",
    data,
  });
  res.status(201).json({ resume });
});

export const updateResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) return res.status(404).json({ message: "Resume not found." });

  const { title, template, accent, data } = req.body;
  if (title !== undefined) resume.title = title;
  if (template !== undefined) resume.template = template;
  if (accent !== undefined) resume.accent = accent;
  if (data !== undefined) resume.data = data;
  await resume.save();
  res.json({ resume });
});

export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!resume) return res.status(404).json({ message: "Resume not found." });
  res.json({ ok: true });
});
