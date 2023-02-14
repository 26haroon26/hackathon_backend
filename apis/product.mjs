import express from "express";
import fs from 'fs';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { AddProductModel, userModel, CategoryModel } from "../dbrepo/model.mjs";
import multer from 'multer';
import bucket from "../firebaseAdmin/index.mjs";
import { v2 as cloudinary } from "cloudinary";

// const storageConfig = multer.diskStorage({
//   // destination: "./uploads/",
//   filename: function (req, file, cb) {
//     // console.log("mul-file: ", file);
//     cb(null, `${new Date().getTime()}-${file.originalname}`);
//   },
// });
// var uploadMiddleware = multer({ storage: storageConfig });

const router = express.Router();


router.post('/product', async (req, res) => {

  console.log(result);

})
router.post("/product", async (req, res) => {
  try {
    const body = req.body;
    const token = jwt.decode(req.cookies.Token);

    if (
      // validation
      !body.text
    ) {
      res.status(400).send({
        message: "required parameters missing",
      });
      return;
    }
    const file = req.files.photo;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "productImage",
      width: 150,
    });

    AddProductModel.create(
      {
        productImage: result.url,
        productName: body.productName,
        productCategory: body.productCategory,
        productDec: body.productDec,
        unitName: body.unitName,
        unitPrice: body.unitPrice,
      },
      (err, saved) => {
        if (!err) {
          console.log(saved);

          res.send({
            message: "product added successfully",
          });
        } else {
          res.status(500).send({
            message: "server error",
          });
        }
      }
    );

  } catch (error) {
    // console.log("error: ", error);
  }
  const file = req.files[0].path;
  console.log(file);
});
router.get("/products", (req, res) => {
  const userID = new mongoose.Types.ObjectId(req.body.token._id);
  AddProductModel.find(
    { owner: userID, isDeleted: false },
    {},
    {
      sort: { _id: -1 },
      limit: 100,
      skip: 0,
    },
    (err, data) => {
      if (!err) {
        res.send({
          message: "got all products successfully",
          data: data,
        });
      } else {
        res.status(500).send({
          message: "server error",
        });
      }
    }
  );
});
router.get("/product/:name", (req, res) => {
  console.log(req.params.name);
  const querryName = req.params.name;
  AddProductModel.find({ name: { $regex: `${querryName}` } }, (err, data) => {
    if (!err) {
      if (data) {
        res.send({
          message: `get product by success`,
          data: data,
        });
      } else {
        res.status(404).send({
          message: "product not found",
        });
      }
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
});
router.post("/addCategory", async (req, res) => {

  try {
    const body = req.body;
    if (
      !body.CategoryName) {
      res.status(400).send(` required parameter missing. example request body:
        {
              "CategoryName": "value",
                    }`);
      return;
    }
    const categoryFile = req.files.CategoryImage;
    const Categoryimage = await cloudinary.uploader.upload(categoryFile.tempFilePath, {
      folder: "Category",
      width: 150,
    });
    console.log(Categoryimage);
    CategoryModel.create(
      {
        CategoryName: body.CategoryName,
        CategoryImage: Categoryimage.url,
      },
      (err, saved) => {
        if (!err) {
          console.log(saved);

          res.send({
            message: "product added successfully",
          });
        } else {
          res.status(500).send({
            message: err,
          });
        }

      })
  } catch (error) {
    res.send({
      message: error,
    });
  }
});
// router.delete("/product/:id", (req, res) => {
//   const id = req.params.id;

//   AddProductModel.deleteOne({ _id: id }, (err, deletedData) => {
//     console.log("deleted: ", deletedData);
//     if (!err) {
//       if (deletedData.deletedCount !== 0) {
//         res.send({
//           message: "Product has been deleted successfully",
//         });
//       } else {
//         res.status(404);
//         res.send({
//           message: "No Product found with this id: " + id,
//         });
//       }
//     } else {
//       res.status(500).send({
//         message: "server error",
//       });
//     }
//   });
// });
router.put("/updateUserFullName", async (req, res) => {
  const body = req.body;
  // // const token = jwt.decode(req.cookies.Token);

  // if (!body.newFullName) {
  //   res.status(400).send(` required parameter missing. example request body:
  //   {
  //     "FullName": "value",
  //   }`);
  //   return;
  // }
  const newUserData = {
    FullName: req.body.newFullName,

  };
  console.log(body.newFullName);
  console.log(body.userID); if (body.userID) {

    const user = await userModel.findByIdAndUpdate(body.userID, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    console.log(user);
    res.status(200).json({
      success: true,
    });

  } else {
    res.status(200).json({
      message: 'some thing wrong',
    });
  }

  // try {
  //   let data = await userModel
  //     .findByIdAndUpdateUpdate(
  //       body.userID,
  //       {
  //         FullName: newFullName,
  //       },
  //       { new: true }
  //     )
  //     .exec();

  //   console.log("updated: ", data);

  //   res.send({
  //     message: "product modified successfully",
  //   });
  // } catch (error) {
  //   res.send({
  //     message: error,
  //   });
  // }


});

export default router;