import "./styles.css";
import { useState, useEffect } from "react";
// let flag = false;
let flag = "asc";
export default function App() {
  const [locations, setLocations] = useState([]);
  const [unsortedLocations, setUnsortedLocations] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [value, setValue] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://randomuser.me/api/?results=20");
      const data = await res.json();
      console.log(data.results);
      const locationData = data.results.map((x) => x.location);
      console.log(locationData);
      const flatten = [];
      locationData.forEach((x) => {
        const { street, coordinates, timezone, ...rest } = x;
        flatten.push({
          ...rest,
          streetName: street.name,
          streetNumber: street.number,
          ...coordinates,
          ...timezone
        });
      });
      console.log("f", Object.keys(flatten[0]));
      setLocations(flatten);
      // still need a different new array
      setUnsortedLocations([...flatten]);
      setHeaders(Object.keys(flatten[0]));
    };
    fetchData().catch((err) => console.log(err));
  }, []);
  const searched = locations.filter((x) => {
    return Object.values(x).some((y) => {
      return y.toString().toLowerCase().includes(value.toLowerCase());
    });
  });
  console.log(111, unsortedLocations);
  const sort = (col) => (e) => {
    // flag = !flag;
    console.log(col);
    if (flag === "asc") {
      locations.sort((a, b) => {
        if (a[col] > b[col]) return 1;
        if (a[col] < b[col]) return -1;
        return 0;
      });
      setLocations([...locations]);
      flag = "desc";
    } else if (flag === "desc") {
      locations.sort((a, b) => {
        if (a[col] < b[col]) return 1;
        if (a[col] > b[col]) return -1;
        return 0;
      });
      setLocations([...locations]);
      flag = "unsorted";
    } else {
      console.log(1, unsortedLocations);
      setLocations([...unsortedLocations]);
      flag = "asc";
    }
    // console.log(222, sorted);
    // sort is in place, still the same array so component won't rerender
  };
  // console.log(2, locations);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            {headers.map((x, i) => (
              <th key={x} onClick={sort(x)}>
                {x}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {searched.map((x, i) => {
            return (
              <tr key={i}>
                {Object.values(x).map((y, id) => (
                  <td key={id}>{y}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
