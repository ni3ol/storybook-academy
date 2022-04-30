import {
  Pagination as BootstrapPagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

export const Pagination = ({
  page,
  pageSize,
  count,
  onChange,
}: {
  page: number;
  pageSize: number;
  count: number;
  onChange: (page: number) => any;
}) => {
  const pages = Math.ceil(count / pageSize);

  return (
    <BootstrapPagination>
      <PaginationItem disabled={page === 1}>
        <PaginationLink first onClick={() => onChange(1)} />
      </PaginationItem>
      <PaginationItem disabled={page === 1}>
        <PaginationLink
          previous
          onClick={() => page !== 1 && onChange(page - 1)}
        />
      </PaginationItem>
      {new Array(pages || 1).fill(0).map((n, i) => {
        return (
          <PaginationItem key={i} active={page === i + 1}>
            <PaginationLink onClick={() => onChange(i + 1)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      })}
      <PaginationItem disabled={pages <= 1 || page === pages}>
        <PaginationLink onClick={() => onChange(page + 1)} next />
      </PaginationItem>
      <PaginationItem disabled={pages <= 1 || page === pages}>
        <PaginationLink onClick={() => onChange(pages)} last />
      </PaginationItem>
    </BootstrapPagination>
  );
};
