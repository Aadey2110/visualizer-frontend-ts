// Essentials
import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

import { Collapsible } from "../Utils/Collapsible";

// Redux Tools
import { AppDispatch, RootState, navigate } from "../../store";

// Components
import { DisplayNode } from "./Node";

import { useAppDispatch, useAppSelector } from "../../Hooks/store";

const format = require("date-format");

export const DisplayEnvironment: React.FC<{ environment: string }> = ({
  environment,
}) => {
  const dispatch: AppDispatch = useAppDispatch(); // Get the dispatch function from Redux
  const userId: string = useAppSelector(
    (state: RootState) => state.user.value.userId
  ); // Get the userId from Redux store

  const [changes, setChanges] = useState<Changes>({}); // State to store the changes da;

  useEffect(() => {
    // Fetch changes data from the API when the component mounts
    axios
      .post("https://teams-bot-app-service.onrender.com/api/changes", {
        userId,
        environment,
      })
      .then((response: AxiosResponse) => {
        // NOTE: Dev-Changes
        // setDisplay(true);
        // if (!Object.keys(changes).length)
        //   setChanges({ ...response.data?.changes });
        // return;
        // ------NOTE: Dev-Changes
        if (response.data.success === true) {
          // If the response is successful, update the state
          console.log(response.data.changes);
          setChanges({
            ...response.data.changes,
            timeStamp: response.data.timeStamp,
          });
        } else {
          // For any other errors, navigate to the 404 error page
          dispatch(navigate({ url: "/error/404" }));
        }
      });
  }, [userId, dispatch]); // Dependency array to re-run effect if changes state updates

  return (
    <div className="Home">
      <Collapsible
        title={
          "Environment: " +
          environment +
          (changes.timeStamp
            ? `  (${format(
                "dd-MM-yyyy hh:mm:ss",
                new Date(changes.timeStamp)
              )})`
            : "")
        }
      >
        <div style={{ marginTop: "12px" }}>
          <div className="main-diff">
            {changes?.paths &&
              Object.keys(changes?.paths).map((node) => {
                return (
                  changes?.paths &&
                  changes?.paths[node] &&
                  changes?.changedValues && (
                    <div
                      className="p-5"
                      style={{
                        border: "1px solid black",
                        borderRadius: "12px",
                        margin: "0px 14px 12px 14px",
                      }}
                    >
                      <DisplayNode
                        name={node}
                        pathsTo={changes?.paths[node]}
                        nodeChanges={changes?.changedValues}
                      />
                    </div>
                  )
                );
              })}
          </div>
        </div>
      </Collapsible>
    </div>
  );
};
