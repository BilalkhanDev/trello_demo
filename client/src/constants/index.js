

export function Constant() {
  const status = {
    0:"PENDING",
    1:"IN_PROGRESS",
    2:"COMPLETED",
  };

  const priority = {
   0:"LOW",
   1: "MEDIUM",
   2:"HIGH",
  };
   const statusMap = {
    0:"PENDING",
    1:"IN_PROGRESS",
    2:"COMPLETED",
  };

  const colorMap = {
          0: 'green',
          1: 'blue',
          2: 'red',
        };

  return {
    status,
    statusMap,
    priority,
    colorMap
  };
}


