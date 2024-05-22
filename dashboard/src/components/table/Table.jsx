import "./table.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const List = () => {
  const rows = [
    {
      id: 1143155,
      counselor: "Psalm",
      name: "John Smith",
      date: "1 March",
      method: "F2F",
      status: "Approved",
    },
    {
      id: 2235235,
      counselor: "Psalm",
      name: "Michael Doe",
      date: "1 March",
      method: "Online",
      status: "Pending",
    },
    {
      id: 2342353,
      counselor : "Ma'am Balatbat",
      name: "John Smith",
      date: "1 March",
      method: "F2F",
      status: "Pending",
    },
    {
      id: 2357741,
      counselor: "Ma'am Balatbat",
      customer: "Jane Smith",
      date: "1 March",
      method: "Online",
      status: "Approved",
    },
    {
      id: 2342355,
      counselor: "Psalm",
      customer: "Harold Carol",
      date: "1 March",
      method: "Online",
      status: "Pending",
    },
  ];

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Tracking ID</TableCell>
            <TableCell className="tableCell">Counselor</TableCell>
            <TableCell className="tableCell">Student</TableCell>
            <TableCell className="tableCell">Date</TableCell>
            <TableCell className="tableCell">Method</TableCell>
            <TableCell className="tableCell">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">{row.counselor}</TableCell>
              <TableCell className="tableCell">{row.name || row.customer}</TableCell>
              <TableCell className="tableCell">{row.date}</TableCell>
              <TableCell className="tableCell">{row.method}</TableCell>
              <TableCell className="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
