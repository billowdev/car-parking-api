import {
  IPaginationLinks,
  IPaginationResponse,
  IDateFilterOptions,
} from "./../interfaces/common.interface";
import moment from 'moment';


export const generatePaginationLinks = (
  host: string,
  page: number,
  pageSize: number,
  totalPages: number
): IPaginationLinks => {
  const links: IPaginationLinks = {
    next: null,
    previous: null,
  };

  if (page < totalPages) {
    links.next = `${host}?page=${page + 1}&pageSize=${pageSize}`;
  }

  if (page > 1) {
    links.previous = `${host}?page=${page - 1}&pageSize=${pageSize}`;
  }

  return links;
};

// export const generatePaginationResponse = <T>(
//   data: T,
//   host: string
// ): IPaginationResponse<T> => {
//   const { total, page, pageSize, totalPages, rows } = data;
//   const links = generatePaginationLinks(host, page, pageSize, totalPages);

//   return {
//     links,
//     total,
//     page,
//     pageSize,
//     totalPages,
//     rows,
//   };
// }

export async function applyFilters<T>(
  where: any,
  filterParam: T,
  filterFields: (keyof T)[] = [],
  filterType: "exact" | "contains" = "contains"
): Promise<void> {
  if (filterFields.length === 0) {
    throw new Error("No filter fields provided");
  }

  for (const field of filterFields) {
    const filterValue = filterParam[field];
    if (filterValue) {
      where[field] =
        filterType === "contains" ? { contains: filterValue } : filterValue;
    }
  }
}
export const applyDateFilters = async (
  where: any,
  dateFilters: IDateFilterOptions
): Promise<void> => {
  const { range_filter_field, start, end, ...otherFilters } = dateFilters;

  if (range_filter_field && (start || end)) {
    where[range_filter_field] = {};
    if (start) {
      where[range_filter_field].gte = parseDateString(start ?? '');
    }
    if (end) {
      where[range_filter_field].lte = parseDateString(end ?? '');
    }
  } else {
    for (const key of Object.keys(otherFilters)) {
      if (key === 'created_after' || key === 'updated_after' || key === 'created_before' || key === 'updated_before') {
        const filterValue = parseDateString(dateFilters[key as keyof IDateFilterOptions] ?? '');
        if (filterValue) {
          if (!where.AND) {
            where.AND = [];
          }
          const field = key === 'created_after' || key === 'updated_after' ? key.replace('_after', '_at') : key.replace('_before', '_at');
          const operator = key.includes('after') ? 'gte' : 'lte';
          const condition: any = {};
          condition[field] = { [operator]: filterValue };
          where.AND.push(condition);
        }
      } else {
        const filterValue = parseDateString(dateFilters[key as keyof IDateFilterOptions] ?? '');
        if (filterValue) {
          if (!where.AND) {
            where.AND = [];
          }
          where.AND.push({ [key]: filterValue });
        }
      }
    }
  }
};


function parseDateString(dateString: string): Date | string {
  try {
    // Try to parse the date string using Moment.js with different formats
    const formatsToTry = [
      'YYYY-MM-DDTHH:mm:ss.SSSZ',
      'YYYY-MM-DDTHH:mm:ss.SSZ',
      'YYYY-MM-DDTHH:mm:ssZ',
      'YYYY-MM-DDTHH:mm:ss',
      'YYYY-MM-DDTHH:mm',
      'YYYY-MM-DDTHH',
      'YYYY-MM-DD',
      'YYYY-MM',
      'YYYY'
    ];

    for (const format of formatsToTry) {
      const parsedDate = moment(dateString, format, true); // Use strict mode for parsing
      if (parsedDate.isValid()) {
        // If parsing succeeds and the date is valid, return it as a JavaScript Date object
        return parsedDate.toDate();
      }
    }

    // If parsing fails for all formats, return the original string
    return dateString;
  } catch (error) {
    // If an error occurs during parsing, return the original string
    return dateString;
  }
}
