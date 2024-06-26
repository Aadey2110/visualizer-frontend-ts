import React, { useState, useEffect } from "react";
import { Box } from "@sprinklrjs/spaceweb/box";
import { DisplayEnvironment } from "./Environment";
import axios, { AxiosResponse } from "axios";
import { useAppSelector } from "../../Hooks/store";
import { AppDispatch, RootState } from "../../store";
import { Navigation } from "../../Navbar";
import { navigate } from "../../store";
import { useAppDispatch } from "../../Hooks/store";

export const DisplayDifference: React.FC = () => {
  console.log("Entered Root.js");
  const userId: string = useAppSelector(
    (state: RootState) => state.user.value.userId
  );
  const [environments, setEnvironments] = useState<string[]>([]);
  const dispatch: AppDispatch = useAppDispatch();

  const [display, setDisplay] = useState<boolean>(false); // State to control the display of the Navigation component

  useEffect(() => {
    console.log("Entered UseEffect");
    axios
      .post("https://teams-bot-app-service.onrender.com/api/environments", {
        userId,
      })
      .then((response: AxiosResponse) => {
        console.log("response", response.data);
        if (response?.data?.success === true) {
          setDisplay(true);
          setEnvironments([...response.data?.environments]);
        } else if (response.data.message === "login first") {
          // If the user needs to log in, navigate to the login error page
          dispatch(navigate({ url: "/error/login" }));
        } else if (response.data.message === "set user preference first") {
          // If the user needs to set preferences, navigate to the preferences page
          dispatch(navigate({ url: "/preferences" }));
        } else {
          // For any other errors, navigate to the 404 error page
          dispatch(navigate({ url: "/error/404" }));
        }
      });
  }, [dispatch, userId]);

  console.log(environments);

  return (
    <div>
      <div className="changes-head" style={{ marginBottom: "200px" }}>
        {display && <Navigation />}
        <Box>
          {environments.map((environment) => (
            <div
              style={{
                border: "1px solid black",
                borderRadius: "12px",
                margin: "12px",
              }}
            >
              <Box className="px-4 py-3">
                <DisplayEnvironment environment={environment} />
              </Box>
            </div>
          ))}
        </Box>
      </div>
    </div>
  );
};
