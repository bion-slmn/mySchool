// Purpose: Provide a form to create a term in the database.
import { useFormSubmit, HandleResult } from "./form";
import { useState } from "react";
import RotatingIcon from "./loadingIcon";
import "../styles/form.css";
import SubmitButton from "./submitButton";
import Error from "./error";
import { useEffect } from "react";

const CreateTerm = () => {
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    grade: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false); // Control form visibility

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleShowForm = () => {
    setShowForm(!showForm); // Toggle form visibility
  };

  let { handleSubmit, error: submitError } = useFormSubmit(
    `api/school/create-term/`,
    formData,
    () => {
      setSubmitted(true);
    },
    true,
    setIsLoading
  );

  // Handle form visibility based on error using useEffect to avoid infinite renders
  useEffect(() => {
    if (submitError) {
      setShowForm(false); // Hide the form when there's an error
      console.log(submitError, 32323232323);
    }
  }, [submitError]); // Trigger this effect only when submitError changes

  return (
    <div className="createterm">
      <h2>Create a Term</h2>
      <button className="menu term" onClick={handleShowForm}>
        Click to create a Term&nbsp;&nbsp;&nbsp;
        {isLoading && <RotatingIcon />}
      </button>
      {submitError && <Error error={submitError} />}{" "}
      {/* Display error message here */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Term name e.g. Term 1 2024"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            required
          />
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            min={formData.start_date} // Corrected: Should be start_date
            onChange={handleInputChange}
            required
          />
          <SubmitButton text="Create Term" isLoading={isLoading} />
        </form>
      )}
      {submitted && <p>Term created successfully!</p>}
    </div>
  );
};

export default CreateTerm;
