//MAIN ACTIONS ADDING OR REMOVING
import { SET_ALERT, REMOVE_ALERT } from "./types";
import { v4 as uuid } from "uuid";
export const setAlert = (msg, type) => {
  const id = uuid();
  console.log("i ran");
  return (dispatch) => {
    dispatch({
      type: SET_ALERT,
      payload: {
        msg,
        type,
        id,
      },
    });
    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERT,
        payload: id,
      });
    }, 5000);
  };
};

/*
[
{
type:
state:{

}
}
,
{
type:
state:{

}
}
]
*/
