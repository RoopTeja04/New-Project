import React from "react";
import {
  MdOutlinePersonOutline,
  MdOutlineLock,
  MdOutlineMail,
} from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Info = ({ setStage, stage, Data, setData }: any) => {

  const [visible, setVisible] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleNextBtn = () => {
    if(!Data.name && !Data.email && !Data.password){
      setError("all");
      return;
    }
    if(!Data.name){
      setError("name");
      return;
    }
    if(!Data.email){
      setError("email");
      return;
    }
    if(!Data.password){
      setError("password");
      return;
    }

    setError("");
    setStage(stage + 1);
  }

  return (
    <div className="flex-1 w-full my-2 space-y-4 pr-20">
      <div className="flex flex-col space-y-1.5 w-full">
        <label className="font-bold text-gray-700">Full Name</label>
        <div className="relative">
          <input
            type="text"
            value={Data.name}
            className={`${error === "name" || error === "all" ? "border-red-500" : "border-gray-300"} w-full border-2 border-gray-300 rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your Full Name"
            onChange={(e) => {
              setData({ ...Data, name: e.target.value });
              if (error === "name" || error === "all") setError("");
            }}
          />
          <MdOutlinePersonOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
        </div>
        {(error === "name" || error === "all") && <p className="text-red-500 font-medium text-sm">Full Name is required</p>}
      </div>

      <div className="flex flex-col space-y-1.5 w-full">
        <label className="font-bold text-gray-700">Email Address</label>
        <div className="relative">
          <input
            type="email"
            value={Data.email}
            className={`${error === "email" || error === "all" ? "border-red-500" : "border-gray-300"} w-full border-2 border-gray-300 rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your Email"
            onChange={(e) => {
              setData({ ...Data, email: e.target.value });
              if (error === "email" || error === "all") setError("");
            }}
          />
          <MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
        </div>
        {(error === "email" || error === "all") && <p className="text-red-500 font-medium text-sm">Email Address is required</p>}
      </div>

      <div className="flex flex-col space-y-1.5 w-full">
        <label className="font-bold text-gray-700">Password</label>
        <div className="relative">
          <input
            type={visible ? "text" : "password"}
            value={Data.password}
            className={`${error === "password" || error === "all" ? "border-red-500" : "border-gray-300"} w-full border-2 border-gray-300 rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your Password"
            onChange={(e) => {
              setData({ ...Data, password: e.target.value });
              if (error === "password" || error === "all") setError("");
            }}
          />
          <MdOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
          {visible ? (
            <FiEyeOff
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
              onClick={() => setVisible(false)}
            />
          ) : (
            <FiEye
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
              onClick={() => setVisible(true)}
            />
          )}
        </div>
        {(error === "password" || error === "all") && <p className="text-red-500 font-medium text-sm">Password is required</p>}
      </div>

      <div className="w-full flex justify-end mt-7">
        <button
          onClick={handleNextBtn}
          className="w-[30%] bg-blue-700 text-white font-medium tracking-[0.7px] rounded-lg p-2.5 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Info;
