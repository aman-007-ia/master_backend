import { errors } from "@vinejs/vine";
import { generateRandomNum, imageValidator } from "../utils/helper.js";
import prisma from "../db/db.config.js";
import fs from "fs";
import path from "path";

class ProfileController {
  static async index(req, res) {
    try {
      const user = req.user;
      return res.json({ status: 200, user });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }

  static async store() {}

  static async show() {}

  static async update(req, res) {
    try {
      const { id } = req.user;

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          status: 400,
          message: "Profile image is required",
        });
      }

      const profile = req.files.profile;
      const message = imageValidator(profile?.size, profile.mimetype);
      if (message !== null) {
        return res.status(400).json({
          errors: {
            profile: message,
          },
        });
      }

      const imgExt = profile?.name.split(".");
      const imageName = generateRandomNum() + "." + imgExt[1];
      const uploadPath = process.cwd() + "/public/images/" + imageName;

      profile.mv(uploadPath, (err) => {
        if (err) throw err;
      });

      await prisma.users.update({
        data: {
          profile: imageName,
        },
        where: {
          id: id,
        },
      });

      return res.json({
        status: 200,
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.log("The error is", error);
      return res
        .status(500)
        .json({ message: "Something went wrong, please try again" });
    }
  }

  static async destory() {}
}

export default ProfileController;
