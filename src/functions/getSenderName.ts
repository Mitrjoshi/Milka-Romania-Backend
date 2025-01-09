import { T_Country } from "@/utils/ConsultixOperations";

export const getSenderName = (language: T_Country, name: string) => {
  if (language === "germany") {
    return `Von ${name}`;
  } else {
    return `By ${name}`;
  }
};
