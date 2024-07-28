import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";

const registerUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    message: "Ok",
  });

  const { fullName, email, username, password } = req.body;
  console.log("email:", email);

  //   if(fullName === ""){
  //     throw new ApiError(400, "FullName is required");
  //   }
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields is required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const AvatarLocalPath = req.files?.avatar[0]?.path;
  const CoverImageLocalPath = req.files?.coverImg[0]?.path;

  if (!AvatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(AvatarLocalPath);
  const coverImg = await uploadOnCloudinary(CoverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImg: coverImg?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating a new user");
  }
});

export { registerUser };
