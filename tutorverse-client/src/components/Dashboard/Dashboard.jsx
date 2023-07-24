import { useContext } from "react";
import { UserContext } from "../../../../userContext";
import StudentHome from "../StudentHome/StudentHome";
import TutorHome from "../TutorHome/TutorHome";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useContext(UserContext);
  console.log(user.firstName);

  if (user.userRole === "tutor") {
    return (
      <div>
        <TutorHome />
      </div>
    );
  } else {
    return (
      <div className="student-home">
        <StudentHome />
      </div>
    );
  }
}
