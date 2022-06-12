import React from "react";
import { useSelector } from "react-redux";
function Alert() {
  const alert = useSelector((state) => state.alertReducer);

  return (
    <>
      {alert.length > 0 &&
        alert.map((st) => (
          <div key={st.id} className={`alert alert-${st.type}`}>
            {st.msg}
          </div>
        ))}
    </>
  );
}

export default Alert;
