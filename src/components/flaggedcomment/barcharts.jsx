import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  import './linecharts.css';
  import React, { useState, useEffect } from "react";
  import { db } from "../../firebase"; // Make sure the path is correct
  import { collection, query, where, getDocs } from "firebase/firestore";
  
  const BarChartComponent = ({ aspect, title }) => {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const querySnapshot1 = await getDocs(query(collection(db, "schedule"), where("counselor", "==", "Sir Psalm Dominic Gregorio, RPm")));
          const totalSchedulesCount1 = querySnapshot1.docs.length;
  
          const querySnapshot2 = await getDocs(query(collection(db, "schedule"), where("counselor", "==", "Ma’am Espie Balatbat, RGC")));
          const totalSchedulesCount2 = querySnapshot2.docs.length;
  
          const querySnapshot3 = await getDocs(query(collection(db, "schedule"), where("counselor", "==", "Sir Josh Asmod")));
          const totalSchedulesCount3 = querySnapshot3.docs.length;
  
          setData([
            { name: "Psalm", Total: totalSchedulesCount1 },
            { name: "Espie", Total: totalSchedulesCount2 },
            { name: "Josh", Total: totalSchedulesCount3 },
          ]);
        } catch (error) {
          console.error("Error fetching total schedules:", error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div className="chart2" >
        <div className="title">{title}</div>
        <p>Number of Schedules per Counselors</p>
        <ResponsiveContainer width="100%" aspect={aspect}>
          <BarChart
            width={730}
            height={250}
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
            <XAxis dataKey="name" stroke="gray" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="Total"
              fill="#8884d8"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default BarChartComponent;
  