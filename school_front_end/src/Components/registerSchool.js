import { useState } from "react";
import { useFormSubmit } from "./form";
import "../styles/form.css";

const RegisterSchool = () => {
  const [school, setSchool] = useState("");
  const [address, setAddress] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { handleSubmit, error } = useFormSubmit(
    "api/school/create-school/",
    { school, address },
    () => {
      // Handle successful login, e.g., redirect or update UI
    },
    true
  );

  return (
    <div className="SchoolRegister">
      <h2>Register a School</h2>
      {/* Button to toggle form visibility */}
      <button onClick={() => setShowForm(!showForm)} className="menu school">
        Click to add a school
      </button>

      {/* Conditionally render the form based on state */}
      {showForm && (
        <form onSubmit={handleSubmit} className="SchoolForm">
          <label>School Name</label>
          <input
            type="text"
            placeholder="Enter the name of the school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            required
          />
          <label>Address of School</label>
          <input
            type="text"
            placeholder="Kakamega Maziwa road, 005100"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <button type="submit">Register</button> {/* Submit button */}
        </form>
      )}

      {/* Display error message if error exists */}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default RegisterSchool;
