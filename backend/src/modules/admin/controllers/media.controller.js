import fs from "fs";
import path from "path";
import Media from "../../../models/media.model.js";
import { config } from "../../../config/index.js";

export const uploadMedia = async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const processedFiles = await Promise.all(
      req.files.map(async (file) => {
        // Validate file type and size
        if (file.mimetype.startsWith("image/")) {
          if (file.size > 5 * 1024 * 1024) {
            fs.unlinkSync(file.path);
            return null;
          }
        } else if (file.mimetype.startsWith("video/")) {
          if (file.size > 50 * 1024 * 1024) {
            fs.unlinkSync(file.path);
            return null;
          }
        } else {
          fs.unlinkSync(file.path);
          return null;
        }

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        // New file name for saved file (on disk)
        const newBaseName =
          path.basename(file.originalname, extension) +
          "-" +
          uniqueSuffix +
          extension;
        const newPath = path.join(uploadDir, newBaseName);

        fs.renameSync(file.path, newPath);

        const stats = fs.statSync(newPath);

        // Return the file's accessible url (do not include protocol/host in disk path)
        // This will allow you to construct public URLs when serving/exposing files elsewhere
        const url =
          `http://localhost:${config.port}/${uploadDir}/${newBaseName}`.replace(
            /\\/g,
            "/"
          );

        return {
          type: file.mimetype.startsWith("image/") ? "image" : "video",
          url,
          fileSize: stats.size,
          userType: req.body.userType || "user",
          createdBy: req.user?.id || "system",
        };
      })
    );

    const validRecords = processedFiles.filter((record) => record !== null);

    if (validRecords.length === 0) {
      return res.status(400).json({ error: "No valid files were processed." });
    }

    const savedRecords = await Media.insertMany(validRecords);

    return res.status(201).json({
      message: "Files uploaded and stored successfully",
      files: savedRecords,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing files." });
  }
};
