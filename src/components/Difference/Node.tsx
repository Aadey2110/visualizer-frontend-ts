import { DisplayDiff } from "./Diff";
import { DisplayPaths } from "./Path";

import { Typography } from "@sprinklrjs/spaceweb/typography";
import { Box } from "@sprinklrjs/spaceweb/box";

import { Collapsible } from "../Utils/Collapsible";

// key -> node affected and values are list
export const DisplayNode: React.FC<DisplayNodeProps> = ({
  name,
  pathsTo,
  nodeChanges,
}) => {
  return (
    <div className="node-head">
      <Collapsible title={"Query: " + name}>
        <Box>
          {pathsTo &&
            Object.keys(pathsTo).map((endNode) => {
              return (
                <Box
                  className="p-4 mt-4"
                  style={{ border: "1px solid black", borderRadius: "12px" }}
                >
                  <Typography variant="body-14">
                    Affected Fragment : {endNode}
                  </Typography>
                  <div>
                    <Typography variant="body-14">Possible Paths :</Typography>
                    <div>
                      <DisplayPaths paths={pathsTo[endNode]} />
                    </div>
                  </div>
                  <div className="diff-display" style={{ paddingTop: "20px" }}>
                    <DisplayDiff
                      oldText={nodeChanges[endNode].oldValue}
                      newText={nodeChanges[endNode].newValue}
                    />
                  </div>
                </Box>
              );
            })}
        </Box>
      </Collapsible>
    </div>
  );
};
