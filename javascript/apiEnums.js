const taskPriorities = {
  undefined: "UNDEFINED",
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
  highest: "HIGHEST",
};

const taskStatus = {
  undefined: "UNDEFINED",
  toDo: "TO_DO",
  inProgress: "IN_PROGRESS",
  resolved: "RESOLVED",
};

const documentType = {
  schematic: "SCHEMATIC",
  pcb: "PCB",
};

const commentContextType = {
  none: "NONE",
  component: "COMPONENT",
  track: "TRACK",
  via: "VIA",
  area: "AREA",
};

module.exports = {
  taskPriorities,
  taskStatus,
  documentType,
  commentContextType,
};
