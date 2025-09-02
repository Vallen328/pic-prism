import DashboardHeader from "../components/DashboardHeader"
import { useLocation } from "react-router-dom"
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip} from "recharts";
import ExpenseCard from "./ExpenseCard";

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const Analytics = () => {
    const {pathname} = useLocation();
  return (
    <div>
      <DashboardHeader />
      <h1 className="text-2xl font-semibold mb-5 ml-8">Analytics</h1>
      <h2 className="text-2xl font-semibold my-5 ml-8">{pathname == "/seller/profile" ? "Uploaded" : "Purchased"} This Year</h2>
      <div className="w-[83vw] sm:w-[80vw] ml-8 p-2 bg-white rounded-2xl shadow-md flex flex-col justify-between items-center gap-5">
        <ResponsiveContainer width="100%" height={150}>
        <LineChart margin= {{
            top: 20,
            bottom: -50,
            left: -61,
        }}data={data}>
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amt" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
        </ResponsiveContainer>

        <p>Total Earned 15000</p>
      </div>

      {/* My 3 expense card will be here */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-10">
        <ExpenseCard />
        <ExpenseCard />
        <ExpenseCard />
      </div>
    </div>
  );
};

export default Analytics
