import { NextApiResponse } from "next";
import { isAxiosError } from "axios";

export const handleError = (error: any, res: NextApiResponse) => {
  if (isAxiosError(error)) {
    res.status(error.response?.status || 500).send(error.response?.data || "Internal server error");
  } else {
    res.status(500).send(error.message || "An unexpected error occurred");
  }
};
