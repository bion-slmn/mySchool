import { useState, useEffect } from "react";
import { fetchData } from "../Components/form";
import FeeAndPayment from "../Components/FeeAndPayment";
import GradeandFees from "../Components/GradeandFees";

const Dashboard = () => {
  const [feeData, setFeeData] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const url = "api/school/percentage-fee-per-grade/";
        const [data, urlError] = await fetchData("GET", url);
        if (urlError) {
          throw new Error(urlError);
        }
        setFeeData(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "An unknown error occurred");
      }
    };

    fetchFees();
  }, []);

  return (
    <div>
      <h2>Grades with fees</h2>
      <GradeandFees data={feeData} />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Dashboard;
