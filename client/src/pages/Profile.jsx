import React, { useEffect, useState } from "react";
import api from "../services/api";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalForm, setOriginalForm] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    userType: "",
    phoneNumber: "",
    image: "",
  });
  const [newImage, setNewImage] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    api
      .get("/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const userData = {
          name: res.data.name || "",
          email: res.data.email || "",
          userType: res.data.userType || "",
          phoneNumber: res.data.phoneNumber || "",
          image: res.data.image || "",
        };
        setForm(userData);
        setOriginalForm(userData);
        setImagePreview(
          userData.image
            ? `http://localhost:5000${userData.image}`
            : "https://i.pravatar.cc/150?img=47"
        );
      })
      .catch((err) => console.error("Failed to fetch profile", err));
  }, []);

  const handleChange = (e) => {
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    setForm(updatedForm);
    checkIfChanged(updatedForm, newImage);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsChanged(true);
    }
  };

  const checkIfChanged = (updatedForm, updatedImage) => {
    const isFormChanged =
      updatedForm.name !== originalForm.name ||
      updatedForm.phoneNumber !== originalForm.phoneNumber;
    const isImageChanged = !!updatedImage;
    setIsChanged(isFormChanged || isImageChanged);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phoneNumber", form.phoneNumber);
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const res = await api.put("/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedData = {
        ...form,
        image: res.data.image,
      };
      setForm(updatedData);
      setOriginalForm(updatedData);
      setNewImage(null);
      setEditMode(false);
      setIsChanged(false);
      setImagePreview(
        res.data.image
          ? `http://localhost:5000${res.data.image}`
          : "https://i.pravatar.cc/150?img=47"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({ ...res.data, role: res.data.userType })
      );
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  const handleCancel = () => {
    setForm(originalForm);
    setNewImage(null);
    setImagePreview(
      originalForm.image
        ? `http://localhost:5000${originalForm.image}`
        : "https://i.pravatar.cc/150?img=47"
    );
    setEditMode(false);
    setIsChanged(false);
  };

  return (
    <div className="pt-28 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex flex-col items-center text-center">
          <img
            src={imagePreview}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-indigo-600"
          />
          {editMode && (
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="mb-4"
            />
          )}
          <h2 className="text-2xl font-bold">{form.name}</h2>
          <p className="text-gray-600 dark:text-gray-300">{form.email}</p>
          <p className="text-sm text-indigo-500 mt-1 capitalize">{form.userType}</p>
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-600" />

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Role</label>
            <input
              type="text"
              name="userType"
              value={form.userType}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white capitalize"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            {!editMode ? (
              <button
                type="button"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className={`px-6 py-2 rounded text-white ${
                    isChanged
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-green-300 cursor-not-allowed"
                  }`}
                  disabled={!isChanged}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
