import { useState, useEffect } from "react";
import { fetchData } from "../Components/form";
import Error from "../Components/error";
import GradeandFees from "../Components/GradeandFees";
import { PageLoading } from "../Components/loadingIcon";

const Dashboard = () => {
  const [feeData, setFeeData] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFees = async () => {
      setIsLoading(true);
      try {
        const url = "api/school/percentage-fee-per-grade/";
        const [data, urlError] = await fetchData("GET", url);
        setIsLoading(false);
        if (urlError) {
          setError(urlError);
          console.log(urlError);
          return;
        }
        console.log(data, "data");
        setFeeData(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "An unknown error occurred");
      }
    };

    fetchFees();
    console.log(feeData, "feeData");
  }, []);

  return (
    <div>
      <h2>Grades with fees</h2>
      {isLoading && <PageLoading />}
      {feeData ? (
        <GradeandFees data={feeData} />
      ) : (
        <p>No data on fees and payments yet...........</p>
      )}
      {error && <Error error={error} />}
    </div>
  );
};

export default Dashboard;
