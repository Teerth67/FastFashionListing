import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.scss";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updatePhoto, updateUser } from "../../redux/features/auth/authSlice";
import { fetchWishlist } from "../../redux/features/wishlist/wishlistSlice"; // Import the wishlist action
import Loader from "../../components/loader/Loader";
import { 
  AiOutlineCloudUpload, 
  AiOutlineEdit, 
  AiOutlineHeart, 
  AiOutlineShopping,
  AiOutlineStar,
  AiOutlineUser,
  AiOutlineInstagram,
  AiOutlineTwitter
} from "react-icons/ai";
import { toast } from "react-toastify";
import { shortenText } from "../../utils";

const cloud_name = process.env.REACT_APP_CLOUD_NAME;
const upload_preset = process.env.REACT_APP_UPLOAD_PRESET;
const url = "https://api.cloudinary.com/v1_1/dpqho0ea3/image/upload";

const Profile = () => {
  const navigate = useNavigate();
  const { isLoading, user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist); // Get wishlist items from redux store
  const initialState = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    photo: user?.photo || "",
    address: {
      address: user?.address?.address || "",
      state: user?.address?.state || "",
      country: user?.address?.country || "",
    },
  };

  const [profile, setProfile] = useState(initialState);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");

  const dispatch = useDispatch();

  // Stats data with dynamic wishlist count
  const stats = [
   // { icon: <AiOutlineShopping />, value: "15", label: "Orders" },
    { icon: <AiOutlineHeart />, value: wishlistItems?.length || "0", label: "Wishlist Items" },
    { icon: <AiOutlineStar />, value: "0", label: "Loyalty Points" },
    { icon: <AiOutlineUser />, value: "0", label: "Followers" },
  ];

  // Tabs data
  const tabs = [
   // { id: "orders", label: "My Orders" },
    { id: "wishlist", label: "Wishlist" },
    { id: "settings", label: "Settings" },
   
    { id: "about", label: "About Us" },
  ];

  useEffect(() => {
    if (user === null) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role: user?.role || "",
        photo: user?.photo || "",
        address: {
          address: user?.address?.address || "",
          state: user?.address?.state || "",
          country: user?.address?.country || "",
        },
      });
      
      // Fetch wishlist when user is available
      dispatch(fetchWishlist(user._id));
    }
  }, [user, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "address" || name === "state" || name === "country") {
      setProfile({
        ...profile,
        address: {
          ...profile.address,
          [name]: value,
        },
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const userData = {
      name: profile.name,
      phone: profile.phone,
      address: {
        address: profile.address.address,
        state: profile.address.state,
        country: profile.address.country,
      },
    };
    await dispatch(updateUser(userData));
  };

  const savePhoto = async (e) => {
    e.preventDefault();
    let imageUrl;
    try {
      if (
        profileImage !== null &&
        (profileImage.type === "image/jpeg" ||
          profileImage.type === "image/jpg" ||
          profileImage.type === "image/png")
      ) {
        const image = new FormData();
        image.append("file", profileImage);
        image.append("cloud_name", cloud_name);
        image.append("upload_preset", upload_preset);

        const response = await fetch(url, { method: "post", body: image });
        const imgData = await response.json();
        imageUrl = imgData.url.toString();

        const userData = {
          photo: imageUrl,
        };
        await dispatch(updatePhoto(userData));
        setImagePreview(null);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "settings":
        return (
          <form onSubmit={saveProfile} className="profile-form">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={profile?.name}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={profile?.email}
                onChange={handleInputChange}
                disabled
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={profile?.phone}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={profile?.address?.address}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={profile?.address?.state}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={profile?.address?.country}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="update-button">
              Update Profile
            </button>
          </form>
        );
      default:
        return (
          <div className="content-section">
            <h3 className="section-title">Coming Soon</h3>
            <p>This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <section className="profile-section">
      {isLoading && <Loader />}
      <div className="container">
        {!isLoading && (
          <>
            <div className="profile-header">
              {/* <div className="cover-photo" /> */}
              <div className="profile-photo">
                <div className="photo-container">
                  <img
                    src={imagePreview === null ? user?.photo : imagePreview}
                    alt="profile"
                    className="profile-image"
                  />
                  <label htmlFor="profile-upload" className="edit-photo-button">
                    <AiOutlineEdit size={20} />
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
              <div className="basic-info">
                <h1 className="user-name">{profile.name}</h1>
                <p className="user-location">
                  📍 {profile.address.state}, {profile.address.country}
                </p>
                <p className="join-date">Member since 2025</p>
                <div className="social-links">
                  <a href="#instagram"><AiOutlineInstagram size={24} /></a>
                  <a href="#twitter"><AiOutlineTwitter size={24} /></a>
                </div>
              </div>
            </div>

            <div className="profile-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card"
                   onClick={() => {
        // Handle Wishlist Items click
        if (stat.label === "Wishlist Items") {
          if (!user) {
            toast.error("Please log in to view your wishlist.");
            return;
          }
          navigate("/wishlist");
        }
      }}
      style={{ 
        cursor: stat.label === "Wishlist Items" ? "pointer" : "default",
      }}
    >
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <nav className="profile-tabs">
            <ul className="tab-list">
                {tabs.map((tab) => (
                  <li
                    key={tab.id}
                    className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => {
                      if (tab.id === "wishlist") {
                        if (!user) {
                          toast.error("Please log in to view your wishlist.");
                          return;
                        }
                        navigate("/wishlist"); // Redirect to wishlist
                      }  else if (tab.id === "about") {
                        navigate("/about-us"); // This will now work with the new route
                      } else {
                        setActiveTab(tab.id);
                      }
                    }}
                  >
                    {tab.label}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="profile-content">
              {imagePreview && (
                <div className="upload-button-container">
                  <button className="upload-button" onClick={savePhoto}>
                    <AiOutlineCloudUpload size={18} /> Upload Photo
                  </button>
                </div>
              )}
              {renderTabContent()}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export const UserName = () => {
  const { user } = useSelector((state) => state.auth);
  const username = user?.name || "...";
  return <span className="username">Hi, {shortenText(username, 9)} | </span>;
};

export default Profile;