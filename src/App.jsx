import Header from "./components/Header"
import Navbar from "./components/Navbar"
import Searchbar from "./components/Searchbar"
import JobCard from "./components/JobCard"
// import JobDummyData from "./JobDummyData"
import { useEffect, useState } from "react"
import { collection, query, orderBy, where, getDocs } from "firebase/firestore";
import {db} from "./firebase.config"

function App() {
  const[jobs, setJobs] = useState([]);
  const [customSearch, setCustomSearch] = useState(false);

  const fetchJobs = async() => {
    setCustomSearch(false);
    const tempJobs = []
    const jobsRef = query(collection(db, "jobs"));
    const q = query(jobsRef, orderBy("postedOn", "desc"));
    const req = await getDocs(q);
    req.forEach((job) => {
  
  // console.log(doc.id, " => ", doc.data());
  tempJobs.push({
    ...job.data(),
    id: job.id,
    postedOn: job.data().postedOn.toDate()
  })
});
setJobs(tempJobs);

  }

  const fetchJobsCustom = async(jobCriteria) => {
    setCustomSearch(true);
    const tempJobs = []
    const jobsRef = query(collection(db, "jobs"));
    const q = query(jobsRef, where("type", "==", jobCriteria.type), where("title", "==", jobCriteria.title), where("experience", "==", jobCriteria.experience), where("location", "==", jobCriteria.location),orderBy("postedOn", "desc"));
    const req = await getDocs(q);
    req.forEach((job) => {
  
  // console.log(doc.id, " => ", doc.data());
  tempJobs.push({
    ...job.data(),
    id: job.id,
    postedOn: job.data().postedOn.toDate()
  })
});
setJobs(tempJobs);

  }

  useEffect(() => {
    fetchJobs()
  }, [])
  return (
    <div>
      <Navbar></Navbar>
      <Header></Header>
      <Searchbar fetchJobsCustom={fetchJobsCustom}/>
      {customSearch &&
      <button onClick={fetchJobs} className="flex pl-[1000px] mb-3">
        <p className="bg-blue-500 px-10 py-2 rounded-md text-white">Clear Filters</p>
      </button>
      }
      {jobs.map((job) => (
        <JobCard key={job.id} {...job}/>
      ))}
    
    </div>
       
  )
}

export default App
