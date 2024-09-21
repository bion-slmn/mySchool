import { useNavigate } from "react-router-dom";
import { useFormSubmit, HandleResult, fetchData } from "./form";
import { useState } from "react";
import "../styles/form.css";

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    gender: "",
    grade: "",
  });

  const [grades, setGrades] = useState([]); // To store grades fetched from the API
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Update handleSubmit to use the correct form data
  let { handleSubmit, error } = useFormSubmit(
    "api/school/register-student/",
    formData, // Pass formData directly
    () => {
      setSubmitted(true);
    },
    true
  );

  // Update formData state on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleShowForm = async () => {
    const url = "api/school/view-all-grades/";

    try {
      const [data, urlError] = await fetchData("GET", url);

      if (urlError) {
        navigate("/login");
      } else {
        console.log(data); // Check data and urlError
        setGrades(data); // Set the fetched grades in the grades state variable
        setShowForm(!showForm); // Show the form
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err); // Handle unexpected errors
    }
  };

  return (
    <div className="Register">
      <h2>Register a student</h2>
      <button className="menu student" onClick={handleShowForm}>
        Click to register a student
      </button>

      {/* Conditionally render the form based on state */}
      {showForm && (
        <form onSubmit={handleSubmit} className="StudentForm">
          <label>Student Name</label>
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <label>Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            required
          />
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <label>Grade</label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Grade</option>
            {grades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name}
              </option>
            ))}
          </select>
          <button type="submit">Register Student</button> {/* Submit button */}
        </form>
      )}

      {submitted && <HandleResult error={error} />}
    </div>
  );
};

export default RegisterStudent;
