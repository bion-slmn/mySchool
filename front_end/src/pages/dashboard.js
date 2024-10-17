import { useState, useEffect } from "react";
import { fetchData } from "../Components/form";
import Error from "../Components/error";
import GradeandFees from "../Components/GradeandFees";
import { PageLoading } from "../Components/loadingIcon";
import { useAuth } from "../Components/AuthProvider";

const Dashboard = () => {
  const date = new Date().toISOString().split("T")[0];
  const [feeData, setFeeData] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ term: "" });
  const [terms, setTerms] = useState([]);
  const { checkTokenAndRefresh } = useAuth();
  const [feeType, setFeeType] = useState("TERM");
  const [dateCreated, setDateCreated] = useState(date);

  const FeeTypes = {
    ADMISSION: "ADMISSION",
    TERM: "TERM",
    ONCE: "ONCE",
    DAILY: "DAILY",
  };

  const fetchTermId = async () => {
    try {
      const url = "api/school/view-terms/?status=True";
      const [data, urlError] = await fetchData(
        "GET",
        url,
        checkTokenAndRefresh
      );
      if (urlError) {
        setError(urlError);
        console.log(urlError);
        return;
      }
      setTerms(data);
      if (data.length > 0) {
        setFormData((prevState) => ({ ...prevState, term: data[0].id }));
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An unknown error occurred");
    }
  };

  const fetchFees = async (termId) => {
    setIsLoading(true);
    try {
      let url = `api/school/percentage-fee-per-grade/?term_id=${termId}&fee_type=${feeType}`;
      if (feeType === "DAILY") {
        url += `&date=${dateCreated}`;
      }
      console.log(url, 232323);
      const [data, urlError] = await fetchData(
        "GET",
        url,
        checkTokenAndRefresh
      );
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    fetchTermId();
  }, []);

  useEffect(() => {
    if (formData.term) {
      fetchFees(formData.term);
    }
  }, [formData.term, dateCreated]);

  return (
    <div>
      <h2>Grades with fees</h2>
      <label>Select Term</label>
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
      <label>Select Fee Type</label>
      <select
        name="fee_type"
        value={feeType}
        onChange={(e) => setFeeType(e.target.value)}
        required
      >
        <option value="">Select Fee Type</option>
        <option value={FeeTypes.ADMISSION}>{FeeTypes.ADMISSION}</option>
        <option value={FeeTypes.TERM}>{FeeTypes.TERM}</option>
        <option value={FeeTypes.ONCE}>{FeeTypes.ONCE}</option>
        <option value={FeeTypes.DAILY}>{FeeTypes.DAILY}</option>
      </select>

      {feeType === FeeTypes.DAILY && (
        <div>
          <label>Date Paid</label>
          <input
            type="date"
            value={dateCreated}
            onChange={(e) => setDateCreated(e.target.value)}
            max={date}
          />
        </div>
      )}

      {isLoading && <PageLoading />}

      {feeData ? (
        <GradeandFees data={feeData} feeType={feeType} />
      ) : (
        <p>No data on fees and payments yet...</p>
      )}

      {error && <Error error={error} />}
    </div>
  );
};

export default Dashboard;
