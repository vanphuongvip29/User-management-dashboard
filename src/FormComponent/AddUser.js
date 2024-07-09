import React, { useState } from "react";
import "../FormComponent/styles.css";
import { Box, Container, Flex } from "@radix-ui/themes";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios"; // Import axios
import "../FormComponent/styles.css";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
  role: yup.string().required("Vui lòng chọn vai trò"),
  firstName: yup.string().required("Vui lòng nhập tên"),
  lastName: yup.string().required("Vui lòng nhập họ"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu"),
  confirmpassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
  avatar: yup.mixed().required("Vui lòng tải lên ảnh đại diện"),
});

const FormUser = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [avatarPreview, setAvatarPreview] = useState(
    "https://photo.znews.vn/w660/Uploaded/qhj_yvobvhfwbv/2018_07_18/Nguyen_Huy_Binh1.jpg"
  );

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // api create user
  const onSubmitForm = async (data) => {
    try {
      // Gọi API với axios
      const response = await axios.post(
        "https://668a5d512c68eaf3211c9a65.mockapi.io/api/User",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data);
      onSubmit(data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Container>
        <Flex gap="3">
          <Box width="500px">
            <div>
              <label>Email</label>
              <input type="email" {...register("email")} />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>

            <div>
              <label>Số điện thoại</label>
              <input type="text" {...register("phone")} />
              {errors.phone && <p className="error">{errors.phone.message}</p>}
            </div>

            <div>
              <label>Vai trò</label>
              <select
                defaultValue="User"
                {...register("role", { required: true })}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
              </select>
            </div>

            <div>
              <label>Tên</label>
              <input type="text" {...register("firstName")} />
              {errors.firstName && (
                <p className="error">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label>Họ</label>
              <input type="text" {...register("lastName")} />
              {errors.lastName && (
                <p className="error">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label>Mật khẩu</label>
              <input type="password" {...register("password")} />
              {errors.password && (
                <p className="error">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label>Xác nhận mật khẩu</label>
              <input type="password" {...register("confirmpassword")} />
              {errors.confirmpassword && (
                <p className="error">{errors.confirmpassword.message}</p>
              )}
            </div>

            <button type="submit">Add user</button>
          </Box>
          <Box width="500px">
            <div>
              <label>Ảnh đại diện</label>
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="avatar-preview"
                />
              )}
              <input
                type="file"
                {...register("avatar")}
                onChange={handleAvatarChange}
              />
              {errors.avatar && (
                <p className="error">{errors.avatar.message}</p>
              )}
            </div>
          </Box>
        </Flex>
      </Container>
    </form>
  );
};

export default FormUser;
