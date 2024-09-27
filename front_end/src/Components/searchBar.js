import { useState, useEffect } from "react";
import { fetchData } from "./form";
import { PageLoading } from "./loadingIcon";
import { useNavigate, useParams } from "react-router-dom";

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchInput(e.target.value);
    console.log(e.target.value, 121212);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchInput) {
      navigate(`/searchResult/${searchInput}`);
    }
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search..."
        value={searchInput}
        onChange={handleChange}
        onKeyUp={handleKeyPress} // Listen for Enter key press
      />
    </div>
  );
};

export const SearchResults = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const { searchInput } = useParams();

  useEffect(() => {
    console.log(searchInput, 121212);
    const fetchSearch = async () => {
      setIsLoading(true);
      try {
        const url = `api/school/search/?search=${searchInput}`;
        const [data, error] = await fetchData("GET", url);
        setIsLoading(false);
        if (error) {
          console.log(error);
          setError(error);
          return;
        }
        setSearchResults(data);
        console.log(data, "data");
      } catch (err) {
        console.error(err);
      }
    };

    fetchSearch();
  }, []);

  const handleClick = (id) => {
    console.log(id);
  };

  if (error) {
    return <p>Error</p>;
  }

  return (
    <div className="feecontainer">
      {isLoading && <PageLoading />}
      <table className="searchresult-table">
        <caption>Results for {searchInput}</caption>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Grade </th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((student) => (
            <tr
              key={student.id}
              onClick={() => {
                handleClick(student.id);
              }}
            >
              <td data-label="Student Name">{student.name}</td>
              <td data-label="Grade">{student.grade_name}</td>
              <td data-label="Gender">{student.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchBar;
