import React from "react";
import Info from "./createStages/Info";
import CompanyDetails from "./createStages/CompanyDetails";
import CompanyInfo from "./createStages/CompanyInfo";

const Create = () => {
  const [stage, setStage] = React.useState<Number>(0);

  const CompanyData = {
    name: "",
    email: "",
    password: "",
    companyName: "",
    website: "",
    description: "",
    designation: "",
  };

  const [Data, setData] = React.useState(CompanyData);

  const stages: any[] = [
    {
      element: (
        <Info setStage={setStage} stage={stage} Data={Data} setData={setData} />
      ),
    },
    {
      element: (
        <CompanyDetails
          setStage={setStage}
          stage={stage}
          Data={Data}
          setData={setData}
        />
      ),
    },
    {
      element: (
        <CompanyInfo
          setStage={setStage}
          stage={stage}
          Data={Data}
          setData={setData}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center h-screen w-full">
        <div className="w-1/2 h-full flex flex-col justify-center px-20 space-y-8">
          <div className="w-full flex flex-col space-y-2">
            <h1 className="text-2xl font-bold tracking-wide">Task Stream</h1>
            <p className="text-md text-gray-500 font-medium tracking-[0.2px]">
              Join 10,000+ teams managing projects with speed.
            </p>
          </div>

          <div className="w-full">{stages[Number(stage)].element}</div>
        </div>
        <div className="bg-blue-950 h-full w-1/2 flex items-center justify-center text-white"></div>
      </div>
    </>
  );
};

export default Create;
