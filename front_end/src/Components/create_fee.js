import { useNavigate } from "react-router-dom";
import { useFormSubmit, HandleResult, fetchData } from "./form";
import { useState, useEffect, useCallback } from "react";
import RotatingIcon from "./loadingIcon";
import "../styles/form.css";
import SubmitButton from "./submitButton";
import Error from "./error";

const FeeType = {
  ADMISSION: "ADMISSION",
  TERM: "TERM",
  ONCE: "ONCE",
  DAILY: "DAILY",
};

const CreateFee = () => {
  const [formData, setFormData] = useState({
    total_amount: "",
    term: "",
    grade_ids: [], // Change to grade_ids to hold an array of selected grades
    description: "",
    fee_type: "TERM",
  });

  let date = new Date();
  let currentYear = date.getFullYear();

  const [grades, setGrades] = useState([]);
  const [terms, setTerms] = useState([]);
  const [year, setYear] = useState(currentYear);
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

    // Check if the fee type is ADMISSION
    if (name === "fee_type" && value === FeeType.ADMISSION) {
      setFormData((prevData) => ({
        ...prevData,
        term: "",
        year: "", // Clear year
        grade_ids: [], // Clear selected grades
      }));
    }
  };

  // Handle checkbox changes for grades
  const handleGradeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const updatedGradeIds = checked
        ? [...prevData.grade_ids, value] // Add grade ID if checked
        : prevData.grade_ids.filter((id) => id !== value); // Remove if unchecked

      return {
        ...prevData,
        grade_ids: updatedGradeIds,
      };
    });
  };

  // Fetch data (terms and grades) with error handling
  const fetchDataFromAPI = async (url, data_type, endpoint_method = "GET") => {
    setIsLoading(true);
    try {
      const [data, urlError] = await fetchData(endpoint_method, url);
      setIsLoading(false);

      if (urlError) {
        setErrorMessage(urlError);
      } else {
        data_type === "grade" ? setGrades(data) : setTerms(data);
        setErrorMessage("");
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage("An unexpected error occurred: " + err.message);
    }
  };

  // Fetch terms when year changes
  useEffect(() => {
    const fetchTerms = async () => {
      const endpoint = `api/school/view-terms/?year=${year}`;
      await fetchDataFromAPI(endpoint, "terms");
    };
    if (year) {
      fetchTerms();
    }
  }, [year]);

  useEffect(() => {
    const fetchTerms = async () => {
      const url = "api/school/view-all-grades/";
      await fetchDataFromAPI(url, "grade");
      console.log(grades, "all grades 777777777");
    };
    if (formData.fee_type && formData.fee_type !== FeeType.ADMISSION) {
      fetchTerms();
    }
  }, []);

  const handleShowForm = async () => {
    setShowForm(!showForm);
  };

  let { handleSubmit, error } = useFormSubmit(
    `api/school/create-fee/`,
    formData,
    () => {
      setSubmitted(true);
    },
    true,
    setIsLoading
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
          <label>Fee Type</label>
          <select
            name="fee_type"
            value={formData.fee_type}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Fee Type</option>
            <option value={FeeType.ADMISSION}>{FeeType.ADMISSION}</option>
            <option value={FeeType.TERM}>{FeeType.TERM}</option>
            <option value={FeeType.ONCE}>{FeeType.ONCE}</option>
            <option value={FeeType.DAILY}>{FeeType.DAILY}</option>
          </select>

          <label>Year</label>
          <input
            type="number"
            placeholder="Select academic year"
            min="2021"
            max="2099"
            step="1"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required={formData.fee_type !== FeeType.ADMISSION} // Only required if not ADMISSION
            disabled={formData.fee_type === FeeType.ADMISSION}
          />

          <label>Select a Term</label>
          <select
            name="term"
            value={formData.term}
            onChange={handleInputChange}
            required={formData.fee_type !== FeeType.ADMISSION}
            disabled={formData.fee_type === FeeType.ADMISSION}
          >
            <option value="">Select a term</option>
            {terms.map((term) => (
              <option value={term.id} key={term.id}>
                {term.name}
              </option>
            ))}
          </select>

          <label>Select Grades</label>
          <div>
            {grades.length ? (
              grades.map((grade) => (
                <div key={grade.id}>
                  <input
                    type="checkbox"
                    value={grade.id}
                    checked={formData.grade_ids.includes(grade.id)}
                    onChange={handleGradeChange}
                    disabled={formData.fee_type === FeeType.ADMISSION}
                  />
                  {grade.name}
                </div>
              ))
            ) : (
              <p>Please set grade first</p>
            )}
          </div>

          <label>Description of Fee</label>
          <textarea
            type="text"
            name="description"
            placeholder="Provide a fee breakdown e.g., exam fee=200 ..."
            value={formData.description}
            onChange={handleInputChange}
            required
          />

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
