import { Table } from "reactstrap";

export const Loader = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      Loading...
    </div>
  );
};

export const DataTable = <R,>({
  headers,
  rows,
}: {
  headers: { key: string; resolve: (row: R) => any; title: string }[];
  rows: R[];
}) => {
  return (
    <>
      <Table>
        <thead>
          <tr>
            {headers.map((header) => {
              return <th key={header.key}>{header.title}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            return (
              <tr key={JSON.stringify(row)}>
                {headers.map((header) => {
                  return <td key={header.key}>{header.resolve(row)}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
