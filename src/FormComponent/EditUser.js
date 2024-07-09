import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Box, Container, Flex } from "@radix-ui/themes";

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
  password: yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp"),
  avatar: yup.mixed().required("Vui lòng tải lên ảnh đại diện"),
});

const EditUserForm = ({ userId, onClose, onUpdate }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://668a5d512c68eaf3211c9a65.mockapi.io/api/User/${userId}`
        ); // Thay đổi URL API thực tế
        setUserData(response.data);
        console.log(response.data);
        reset(response.data); // Đưa dữ liệu vào form
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [userId, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `https://668a5d512c68eaf3211c9a65.mockapi.io/api/User/${userId}`,
        data
      ); // Thay đổi URL API thực tế
      console.log("Update user success:", response.data);
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const [avatarPreview, setAvatarPreview] = useState("null");
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
              <label>First Name</label>
              <input type="text" {...register("firstName")} />
              {errors.firstName && (
                <p className="error">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label>Last Name</label>
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
              <input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword.message}</p>
              )}
            </div>
            <button type="submit">Update User</button>
          </Box>
          <Box>
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

export default EditUserForm;
