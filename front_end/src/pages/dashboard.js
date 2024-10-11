import { useState, useEffect } from "react";
import { fetchData } from "../Components/form";
import Error from "../Components/error";
import GradeandFees from "../Components/GradeandFees";
import { PageLoading } from "../Components/loadingIcon";

const Dashboard = () => {
  const [feeData, setFeeData] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    term: "",
  });
  const [terms, setTerms] = useState([]);

  // Fetch the active term on component mount
  const fetchTermId = async () => {
    try {
      const url = "api/school/view-terms/?status=True"; // Fetch active terms
      const [data, urlError] = await fetchData("GET", url);
      if (urlError) {
        setError(urlError);
        console.log(urlError);
        return;
      }
      setTerms(data); // Save all terms in state
      setFormData((prevState) => ({
        ...prevState,
        term: data[0].id, // Set the first active term as default
      }));
    } catch (err) {
      console.error(err);
      setError(err.message || "An unknown error occurred");
    }
  };

  // Fetch fees based on the selected ter

  const fetchFees = async (termId) => {
    setIsLoading(true);
    try {
      const url = `api/school/percentage-fee-per-grade/?term_id=${termId}`;
      const [data, urlError] = await fetchData("GET", url);
      setIsLoading(false);
      if (urlError) {
        setError(urlError);
        console.log(urlError);
        return;
      }
      console.log(data, "data1111111111111111111");
      setFeeData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "An unknown error occurred");
    }
  };

  // Handle input change when a user selects a new term
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // When the component mounts, fetch active term
  useEffect(() => {
    fetchTermId();
  }, []);

  // When the term changes, fetch the fees for that term
  useEffect(() => {
    if (formData.term) {
      fetchFees(formData.term);
    }
  }, [formData.term]);

  return (
    <div>
      <h2>Grades with fees</h2>

      <select
        name="term"
        value={formData.term}
        onChange={handleInputChange}
        required
      >
        <option value="">Select a term</option>
        {terms.map((term) => (
          <option value={term.id} key={term.id}>
            {term.name}
          </option>
        ))}
      </select>

      {isLoading && <PageLoading />}

      {feeData ? (
        <GradeandFees data={feeData} />
      ) : (
        <p>No data on fees and payments yet...</p>
      )}

      {error && <Error error={error} />}
    </div>
  );
};

export default Dashboard;
