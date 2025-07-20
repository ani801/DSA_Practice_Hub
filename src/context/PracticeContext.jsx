import { useEffect, useState, createContext, useMemo} from "react";
import axios from "axios";
import { Url } from "../App";

const PracticeContext = createContext();
export default PracticeContext;

const PracticeContextProvider = ({ children }) => {
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState(["All Topics"]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(() => {
    const currusername = localStorage.getItem("username");
    const storedUser = localStorage.getItem(currusername);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [potdProblem, setPotdProblem] = useState(null);

  // Sync user state to localStorage & update auth status
 useEffect(() => {
  const currusername = localStorage.getItem("username");

  if (currusername) {
    setUsername(currusername);
    console.log("Username:", currusername);

    const storedUser = localStorage.getItem(currusername);
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    console.log("Parsed User:", parsedUser);

    if (parsedUser) {
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  } 
}, [username]);



  // Fetch user info from server to validate session
  const fetchMe = async () => {
    try {
      const response = await axios.get(`${Url}/api/user/me`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem(response.data.user.username, JSON.stringify(response.data.user));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("username");
        localStorage.removeItem(response.data.user.username);
      }
    } catch (error) {
      setUser(null); // Logout on failure
      console.error("User fetch error:", error.message);
    }
  };

  // Fetch all problems
  const fetchProblems = async () => {
    try {
      const response = await axios.get(`${Url}/api/dsa/fetch`, {
        withCredentials: true,
      });
      if (response.data.success === false) {
        setProblems([]);

              localStorage.removeItem(localStorage.getItem("username"));
              localStorage.removeItem("username");
              setIsAuthenticated(false);


            }

      if (response.data.success && Array.isArray(response.data.data)) {
        setProblems(response.data.data);
      }
    } catch (error) {
       if(error.response && error.response.status === 401) {
          setProblems([]);
          localStorage.removeItem(localStorage.getItem("username"));
          localStorage.removeItem("username");
          setIsAuthenticated(false);
       }
      console.error("Problem fetch error:", error.message);
    }
  };

  // Fetch POTD with retry logic
  const fetchPOTD = async (retry = 1) => {
    try {
      const response = await axios.get(`${Url}/api/potd/dailypotd`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setPotdProblem(response.data.data);
      }
    } catch (err) {
      if (retry < 3) {
        setTimeout(() => fetchPOTD(retry + 1), 1000);
      } else {
        console.error("POTD fetch failed after 3 retries");
      }
    }
  };

  // Initial fetch on mount
  useEffect(() => {
   if (user) fetchPOTD();
      if (isAuthenticated&&!localStorage.getItem("username")) fetchMe(); // Avoid refetching if user already in localStorage
  }, []);

  // Fetch problems after authentication or external trigger
  useEffect(() => {
    if (isAuthenticated) {
      if (user) fetchProblems();
    }
  }, [isAuthenticated, trigger]);

  // Extract unique topics from problems
  useEffect(() => {
    const topicSet = new Set(["All Topics"]);
    problems.forEach((problem) => {
      problem.tags.forEach((tag) => topicSet.add(tag));
    });
    setTopics(Array.from(topicSet));
  }, [problems]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    problems,
    setProblems,
    fetchProblems,
    topics,
    username,
    setUsername,
    isAuthenticated,
    setIsAuthenticated,
    trigger,
    setTrigger,
    potdProblem,
    user,
    setUser,
    
  }), [
    problems,
    topics,
    username,
    isAuthenticated,
    trigger,
    potdProblem,
    user,
  ]);

  return (
    <PracticeContext.Provider value={contextValue}>
      {children}
    </PracticeContext.Provider>
  );
};

export { PracticeContextProvider };
