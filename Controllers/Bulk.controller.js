import xlsx from "xlsx";

import { User } from "../Models/User.model.js";

export const bulkUploadStudents = async (req, res) => {
  try {
    // File check
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Read Excel/CSV
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!data.length) {
      return res
        .status(400)
        .json({ success: false, message: "File is empty" });
    }

    //  Map only required fields
    const students = data.map((row) => ({
      rollNumber: row.RollNo || row.rollNumber || null,
      name: row.Name || row.name || null,
      email: row.Email || row.email || null,
      password: row.Password || "123456", // default password
      class: row.Class || row.class || "",
      role: row.Role || "student",
    }));

    // Filter invalid rows
    const validStudents = students.filter(
      (s) => s.rollNumber && s.name && s.email
    );

    if (!validStudents.length) {
      return res
        .status(400)
        .json({ success: false, message: "No valid student records found" });
    }

    //Insert into DB (ignore duplicates gracefully)
    let inserted = [];
    try {
      inserted = await User.insertMany(validStudents, { ordered: false });
    } catch (err) {
      console.error("Insert error (duplicates ignored):", err.writeErrors?.length || err);
    }

    
    res.status(200).json({
      success: true,
      message: "Bulk upload completed",
      totalRows: validStudents.length,
      insertedCount: inserted.length,
      failedCount: validStudents.length - inserted.length,
    });
  } catch (err) {
    console.error("Bulk upload error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while uploading students",
      error: err.message,
    });
  }
};
