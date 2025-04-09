import React, { useState, useEffect, useRef } from "react";
import "./App.css"; // Import CSS for styling

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    notificationsEnabled: false,
    users: ["Narendra Modi", "Narendra Modi", "Narendra Modi"],
    categories: ["Hiring", "Budget 2025", "Resignation"],
    replies: [
      "Sorry, I won’t be able to attend",
      "Let’s move forward on the conversation",
    ],
  });
  const [initialFormData, setInitialFormData] = useState({ ...formData });
  const [changesMade, setChangesMade] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [inputValues, setInputValues] = useState({
    users: "",
    categories: "",
    replies: "",
  });

  const isInitialMount = useRef(true);

  // Function to compare if the forms have changed
  const areFormsDifferent = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setChangesMade(false); // Initial render, no changes yet
    } else {
      setChangesMade(areFormsDifferent());
    }
  }, [formData]);

  // Debounced save effect
  useEffect(() => {
    if (!changesMade) return;

    const timeoutId = setTimeout(() => {
      handleSaveChanges();
    }, 2000); // 2-second debounce

    return () => clearTimeout(timeoutId);
  }, [changesMade]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputValueChange = (name, value) => {
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSuggestionClick = (name, suggestion) => {
    setInputValues((prev) => ({
      ...prev,
      [name]: suggestion,
    }));

    if (!formData[name].includes(suggestion)) {
      const newFormData = {
        ...formData,
        [name]: [...formData[name], suggestion],
      };
      setFormData(newFormData);
    }
    if (isInitialMount.current) return;
    setChangesMade(true);
  };

  const handleKeyDown = (name, event) => {
    if (event.key === "Enter" && inputValues[name].trim()) {
      if (!formData[name].includes(inputValues[name].trim())) {
        const newFormData = {
          ...formData,
          [name]: [...formData[name], inputValues[name].trim()],
        };
        setFormData(newFormData);
      }
      setInputValues((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (isInitialMount.current) return;
    setChangesMade(true);
  };

  const handleNotificationsChange = (event) => {
    const newValue = event.target.checked;
    handleChange("notificationsEnabled", newValue);
    if (isInitialMount.current) return;
    setChangesMade(true);
  };

  const handleSaveChanges = async () => {
    if (!changesMade) return;

    setIsSaving(true);

    // Dummy API call
    try {
      console.log("Saving changes:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
      console.log("Changes saved successfully!");
      setInitialFormData({ ...formData });
      setChangesMade(false);
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const removeItem = (name, index) => {
    const updatedItems = [...formData[name]];
    updatedItems.splice(index, 1);
    handleChange(name, updatedItems);
  };

  const handleSearch = (name) => {
    if (inputValues[name].trim()) {
      if (!formData[name].includes(inputValues[name].trim())) {
        const newFormData = {
          ...formData,
          [name]: [...formData[name], inputValues[name].trim()],
        };
        setFormData(newFormData);
        setChangesMade(true);
      }
      setInputValues((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="settings-container">
      <h1>Application Settings</h1>

      {/* Notification Settings */}
      <section className="settings-section">
        <h2>Notification Settings</h2>
        <p>
          We keep the notifications off by default. You can change the settings
          for messages individually or you can reset to default.
        </p>
        <p>
          Do you want notifications for every message? You will receive
          notification on the registered email address
        </p>
        <label className="toggle">
          <input
            type="checkbox"
            checked={formData.notificationsEnabled}
            onChange={handleNotificationsChange}
          />
          <span className="slider"></span>
        </label>
        <div className="separator"></div>
      </section>

      {/* Add Users Section */}
      <section className="settings-section">
        <div className="form-group">
          <label>Add users to get particular notifications</label>
          <div className="search-bar">
            <i className="fa fa-search"></i>
            <input
              type="text"
              placeholder="Search Users"
              value={inputValues.users}
              onChange={(e) => handleInputValueChange("users", e.target.value)}
              onKeyDown={(e) => handleKeyDown("users", e)}
            />
          </div>
          <div className="tags">
            {formData.users.map((user, index) => (
              <span
                key={index}
                className="tag"
                onClick={() => handleSuggestionClick("users", user)}
              >
                {user}{" "}
                <button onClick={() => removeItem("users", index)}>×</button>
              </span>
            ))}
          </div>
        </div>
        <div className="separator"></div>
      </section>

      {/* Message Categories */}
      <section className="settings-section">
        <h2>Message Categories</h2>
        <p>
          These are the categories which are visible to the user. This also
          helps you to filter and view messages as per your requirement.
        </p>
        <div className="form-group">
          <label>Add the categories</label>
          <div className="search-bar">
            <i className="fa fa-search"></i>
            <input
              type="text"
              placeholder="Enter the category name"
              value={inputValues.categories}
              onChange={(e) =>
                handleInputValueChange("categories", e.target.value)
              }
              onKeyDown={(e) => handleKeyDown("categories", e)}
            />
          </div>
          <div className="tags">
            {formData.categories.map((category, index) => (
              <span
                key={index}
                className="tag"
                onClick={() => handleSuggestionClick("categories", category)}
              >
                {category}{" "}
                <button onClick={() => removeItem("categories", index)}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="separator"></div>
      </section>

      {/* Custom Replies */}
      <section className="settings-section">
        <h2>Custom Replies</h2>
        <p>These are custom replies which you can send to users instantly.</p>
        <div className="form-group">
          <label>Add replies</label>
          <div className="search-bar">
            <i className="fa fa-search"></i>
            <input
              type="text"
              placeholder="Add replies"
              value={inputValues.replies}
              onChange={(e) =>
                handleInputValueChange("replies", e.target.value)
              }
              onKeyDown={(e) => handleKeyDown("replies", e)}
            />
          </div>
          <div className="tags">
            {formData.replies.map((reply, index) => (
              <span
                key={index}
                className="tag"
                onClick={() => handleSuggestionClick("replies", reply)}
              >
                {reply}{" "}
                <button onClick={() => removeItem("replies", index)}>×</button>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Save Status */}
      {isSaving && <div className="save-status">Saving changes...</div>}
      {changesMade && !isSaving && (
        <div className="save-status">Changes detected - auto-saving soon</div>
      )}
    </div>
  );
};

export default SettingsPage;
