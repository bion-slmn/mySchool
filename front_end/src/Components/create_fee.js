import { useNavigate } from "react-router-dom";
import { useFormSubmit, HandleResult, fetchData } from "./form";
import { useState } from "react";
import RotatingIcon from "./loadingIcon";
import "../styles/form.css";
import SubmitButton from "./submitButton";
import Error from "./error";

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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleShowForm = async () => {
    const url = "api/school/view-all-grades/";
    setIsLoading(true);
    try {
      const [data, urlError] = await fetchData("GET", url);
      setIsLoading(false);

      if (urlError) {
        setErrorMessage(urlError);
      } else {
        console.log(data); // Check data and urlError
        setGrades(data); // Set the fetched grades in the grades state variable
        setShowForm(!showForm);
        setErrorMessage("");
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err); // Handle unexpected errors
      setErrorMessage(err.message);
    }
  };

  let { handleSubmit, error } = useFormSubmit(
    `api/school/create-fee/${formData.grade}/`,
    formData, // Pass formData directly
    () => {
      setSubmitted(true);
    },
    true
  );

  if (error) {
    setErrorMessage(error);
  }

  return (
    <div className="createfee">
      <h2>Create a fee</h2>
      <button className="menu fee" onClick={handleShowForm}>
        Click to create a Fee&nbsp;&nbsp;&nbsp;
        {isLoading && <RotatingIcon />}
      </button>
      {errorMessage && <Error error={errorMessage} />}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter fee name e.g. Class 1 term 1 fee"
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
          <SubmitButton text="Create Fee" isLoading={isLoading} />
        </form>
      )}
      {submitted && <HandleResult error={errorMessage} />}
    </div>
  );
};

export default CreateFee;
