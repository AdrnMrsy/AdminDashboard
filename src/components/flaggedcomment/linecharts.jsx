import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import './linecharts.css';
import { useEffect, useState } from "react";
import { db } from "../../firebase"; // Import your Firebase configuration
import { collection, query, getDocs, where } from "firebase/firestore";

const LineChart = ({ aspect, title }) => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const threadsSnapshot = await getDocs(
          query(
            collection(db, "threads"),
            where("createdAt", ">=", new Date(selectedYear, 0, 1)),
            where("createdAt", "<=", new Date(selectedYear, 11, 31))
          )
        );
        const threads = threadsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        // Initialize an object to store the message counts for each month
        const messageCountsByMonth = {
          "January": 0,
          "February": 0,
          "March": 0,
          "April": 0,
          "May": 0,
          "June": 0,
          "July": 0,
          "August": 0,
          "September": 0,
          "October": 0,
          "November": 0,
          "December": 0
        };

        // Iterate through threads and count messages for each month
        threads.forEach(thread => {
          const timestamp = thread.createdAt.toDate(); // Assuming the timestamp is stored as a Firestore Timestamp
          const month = timestamp.getMonth();
          const monthName = getMonthName(month);

          messageCountsByMonth[monthName]++;
        });

        // Create an array of objects for all months
        const allMonthsData = Object.keys(messageCountsByMonth).map(month => ({ name: month, Total: 0 }));

        // Merge the message counts by month with the all months data
        const mergedData = allMonthsData.map(monthData => {
          const monthCount = messageCountsByMonth[monthData.name];
          return { ...monthData, Total: monthCount };
        });

        setData(mergedData);
      } catch (error) {
        console.error("Error fetching total messages:", error);
      }
    };

    fetchData();
  }, [selectedYear]);

  // Function to get month name from month number
  const getMonthName = (monthNumber) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[monthNumber];
  };

  // Handle year change
  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  
  return (
    <div className="chart">
      <div className="title">{title}</div>
      <p>Number of Messages Each Month</p>
      <div>
        <label htmlFor="yearSelect">Select Year: </label>
        <select id="yearSelect" value={selectedYear} onChange={handleYearChange}>
          {/* Render options for the last 5 years */}
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
