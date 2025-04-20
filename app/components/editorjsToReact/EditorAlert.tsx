import React from "react";
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface Props {
  type: "info" | "warning" | "error" | "success";
  align: "left" | "center" | "right";
  message: string;
}

const EditorAlert = ({ type, align, message }: Props) => {
  let alignmentClass;
  switch (align) {
    case "left":
      alignmentClass = "text-left";
      break;
    case "center":
      alignmentClass = "text-center";
      break;
    case "right":
      alignmentClass = "text-right";
      break;
    default:
      alignmentClass = "text-left";
  }

  let alertClass;
  let IconComponent;
  switch (type) {
    case "info":
      alertClass = "alert alert-info";
      IconComponent = InformationCircleIcon;
      break;
    case "warning":
      alertClass = "alert alert-warning";
      IconComponent = ExclamationTriangleIcon;
      break;
    case "error":
      alertClass = "alert alert-error";
      IconComponent = XCircleIcon;
      break;
    case "success":
      alertClass = "alert alert-success";
      IconComponent = CheckCircleIcon;
      break;
    default:
      alertClass = "alert";
      IconComponent = InformationCircleIcon;
  }

  return (
    <div role="alert" className={`${alertClass} flex items-center my-8`}>
      <IconComponent className="w-6 h-6 mr-2" />
      <span className={alignmentClass}>{message}</span>
    </div>
  );
};

export default EditorAlert;
