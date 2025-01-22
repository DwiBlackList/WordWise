var _a;
import { r as reactExports, R as React, b as ReactDOM, B as BrowserRouter } from "./chunk-K6AXKMTT-llj0GQDa.js";
import { R as ReportsComponent, B as Box, G as Grid2, S as Sidebar } from "./Sidebar-7LvJyKI1.js";
import { a as axios } from "./axios-Cl7A0Ixg.js";
import "./_commonjsHelpers-DWwsNxpa.js";
const Table = ({ data }) => {
  const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
  csrfTokenElement ? csrfTokenElement.getAttribute("content") : "";
  reactExports.useState(false);
  reactExports.useState(null);
  const handleRowClick = async (id) => {
    console.log(id);
    try {
      const response = await axios.get(`/levels/${id}`);
      if (response.status !== 200) {
        console.error("Failed to fetch level data");
      }
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto w-full" }, /* @__PURE__ */ React.createElement("table", { className: "table-auto w-full border-collapse shadow-xl" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-white border-b border-gray-200" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-2 sm:px-4 py-2 text-left text-gray-600 w-1/3" }, "Level Name"), /* @__PURE__ */ React.createElement("th", { className: "px-2 sm:px-4 py-2 text-left text-gray-600 w-1/3" }, "Chapter Name"))), /* @__PURE__ */ React.createElement("tbody", null, /* @__PURE__ */ React.createElement(
    "tr",
    {
      key: data.level.id,
      className: "bg-white hover:bg-gray-100",
      onClick: () => handleRowClick(data.level.id)
    },
    /* @__PURE__ */ React.createElement("td", { className: "px-2 sm:px-4 py-2" }, data.level.level_name),
    /* @__PURE__ */ React.createElement("td", { className: "px-2 sm:px-4 py-2" }, data.level.chapter_name)
  ))));
};
const TableStudents = ({ data }) => {
  console.log(data);
  reactExports.useState(false);
  reactExports.useState(null);
  return /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto w-full" }, /* @__PURE__ */ React.createElement("table", { className: "table-auto w-full border-collapse shadow-xl" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-white border-b border-gray-200" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-2 sm:px-4 py-2 text-left text-gray-600 w-1/3" }, "Student Name"), /* @__PURE__ */ React.createElement("th", { className: "px-2 sm:px-4 py-2 text-left text-gray-600 w-1/3" }, "Score"))), /* @__PURE__ */ React.createElement("tbody", null, data == null ? void 0 : data.map((row, index) => {
    var _a2;
    return /* @__PURE__ */ React.createElement("tr", { key: index, className: "bg-white hover:bg-gray-100" }, /* @__PURE__ */ React.createElement("td", { className: "px-2 sm:px-4 py-2" }, row.name), /* @__PURE__ */ React.createElement("td", { className: "px-2 sm:px-4 py-2" }, (_a2 = row.results[0]) == null ? void 0 : _a2.score));
  }))));
};
const Page = ({ data }) => {
  const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
  csrfTokenElement ? csrfTokenElement.getAttribute("content") : "";
  reactExports.useState(false);
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen overflow-y-auto bg-gray-100 p-4" }, /* @__PURE__ */ React.createElement(ReportsComponent, { name: data.level.level_name }), /* @__PURE__ */ React.createElement(Box, { sx: { flexGrow: 1 } }, /* @__PURE__ */ React.createElement(Grid2, { container: true, mt: 2 }, /* @__PURE__ */ React.createElement(Grid2, { size: { xs: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-xl mb-6" }, /* @__PURE__ */ React.createElement(Table, { data })), /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-xl" }, /* @__PURE__ */ React.createElement(TableStudents, { data: data.student }))))));
};
const TableCRUD = ({ ssrData: ssrData2 }) => {
  const [data, setData] = reactExports.useState({
    dataUserLogin: ssrData2.dataUserLogin,
    level: ssrData2.level,
    student: ssrData2.users
  });
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen overflow-hidden" }, /* @__PURE__ */ React.createElement(Sidebar, { user: data.dataUserLogin }), /* @__PURE__ */ React.createElement("div", { className: "relative flex flex-col flex-1 overflow-x-hidden" }, /* @__PURE__ */ React.createElement("main", null, /* @__PURE__ */ React.createElement(Page, { data }))));
};
const ssrData = (_a = document.getElementById("app")) == null ? void 0 : _a.getAttribute("ssrData");
const initialData = ssrData ? JSON.parse(ssrData) : {};
if (document.getElementById("app")) {
  ReactDOM.createRoot(document.getElementById("app")).render(
    /* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(BrowserRouter, null, /* @__PURE__ */ React.createElement(TableCRUD, { ssrData: initialData })))
  );
}
