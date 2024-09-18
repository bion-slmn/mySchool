import { useNavigate } from "react-router-dom";
import { useFormSubmit, HandleResult, fetchData } from "./form";
import { useState } from "react";
import "../styles/form.css";

const CreateFee = () => {
  const [formData, setFormData] = useState({
    name: "",
    total_amount: "",
    from_date: "",
    to_date: "",
    grade: "",
  });

  const [grades, setGrades] = useState([]); // To store grades fetched from the API
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleShowForm = async () => {
    const url = "http://localhost:8000/api/school/view-all-grades/";

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

  let { handleSubmit, error } = useFormSubmit(
    `http://localhost:8000/api/school/create-fee/${formData.grade}/`,
    formData, // Pass formData directly
    () => {
      setSubmitted(true);
    },
    true
  );

  return (
    <div className="createfee">
      <h2>Create a fee</h2>
      <button className="menu fee" onClick={handleShowForm}>
        Click to create a Fee
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <label>Start Date</label>
          <input
            type="date"
            name="from_date"
            value={formData.from_date}
            onChange={handleInputChange}
            required
          />
          <label>Expiry Date</label>
          <input
            type="date"
            name="to_date"
            value={formData.to_date}
            min={formData.from_date}
            onChange={handleInputChange}
            required
          />
          <label>Grade</label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a grade</option>
            {grades.map((grade) => (
              <option value={grade.id} key={grade.id}>
                {grade.name}
              </option>
            ))}
          </select>
          <label>Amount</label>
          <input
            type="number"
            name="total_amount"
            value={formData.total_amount}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Create A Fee</button>
        </form>
      )}
      {submitted && <HandleResult error={error} />}
    </div>
  );
};

export default CreateFee;
