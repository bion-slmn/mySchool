import { useState } from "react";
import { useFormSubmit } from "./form";
import "../styles/form.css";
import SubmitButton from "./submitButton";

const RegisterSchool = () => {
  const [school, setSchool] = useState("");
  const [address, setAddress] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading

  const { handleSubmit, error } = useFormSubmit(
    "api/school/create-school/",
    { school, address },
    () => {
      setIsLoading(false); // Stop loading when the form is successfully submitted
    },
    true,
    setIsLoading
  );

  return (
    <div className="SchoolRegister">
      <h2>Register a School</h2>
      <button onClick={() => setShowForm(!showForm)} className="menu school">
        Click to add a school
      </button>

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
          <SubmitButton text="Register" isLoading={isLoading} />
        </form>
      )}

      {/* Display error message if error exists */}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default RegisterSchool;
