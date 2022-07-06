import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/router";
const BackButton = () => {
  const router = useRouter();
  return (
    <>
      <button
        className="backButton"
        onClick={() => {
          router.back();
        }}
      >
        <FaArrowLeft />
      </button>
    </>
  );
};

export default BackButton;
