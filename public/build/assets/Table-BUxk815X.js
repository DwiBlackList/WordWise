var _a;
import { r as reactExports, R as React, b as ReactDOM, B as BrowserRouter } from "./chunk-K6AXKMTT-CTFu9QFo.js";
import { R as ReportsComponent, B as Box, G as Grid2, S as Sidebar } from "./Sidebar-Kaq3-wnM.js";
import { a as FaPencil, F as FaRegTrashCan } from "./index-BWM9Cntx.js";
import { a as axios } from "./axios-Cl7A0Ixg.js";
import "./_commonjsHelpers-DWwsNxpa.js";
const Table = ({ data }) => {
  var _a2;
  axios.defaults.headers.common["X-CSRF-TOKEN"] = (_a2 = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a2.getAttribute("content");
  reactExports.useState(false);
  reactExports.useState(null);
  const handleRowClick = async (id) => {
    try {
      const response = await axios.get(`classes/${id}`);
      if (response.status === 200) {
        window.location.href = `/classes/${id}`;
      } else {
        console.error("Failed to retrieve class data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/classes/${id}`);
      if (response.status === 201) {
        console.log("Class deleted successfully");
        window.location.reload();
      } else {
        console.error("Failed to delete class");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto w-full" }, /* @__PURE__ */ React.createElement("table", { className: "table-auto w-full border-collapse shadow-xl" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-white border-b border-gray-200" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-2 sm:px-4 py-2 text-left text-gray-600" }, "Class Name"), /* @__PURE__ */ React.createElement("th", { className: "px-2 sm:px-4 py-2 text-left text-gray-600" }, "Token"), /* @__PURE__ */ React.createElement("th", { className: "px-2 sm:px-4 py-2 text-center text-gray-600" }, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, data == null ? void 0 : data.map((row, _) => /* @__PURE__ */ React.createElement(
    "tr",
    {
      key: row.id,
      className: "bg-white  hover:bg-gray-100"
    },
    /* @__PURE__ */ React.createElement("td", { className: "px-2 sm:px-4 py-2 " }, row.class_name),
    /* @__PURE__ */ React.createElement("td", { className: "px-2 sm:px-4 py-2" }, row.token),
    /* @__PURE__ */ React.createElement("td", { className: "px-2 sm:px-4 py-2 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-4 justify-center" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "text-gray-500 transition duration-200",
        onClick: (e) => {
          e.stopPropagation();
          handleRowClick(row.id);
        }
      },
      /* @__PURE__ */ React.createElement(FaPencil, null)
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "text-gray-500 transition duration-200",
        onClick: (e) => {
          e.stopPropagation();
          if (window.confirm(
            `Are you sure you want to delete ${row.class_name}?`
          )) {
            handleDelete(row.id);
          }
        }
      },
      /* @__PURE__ */ React.createElement(FaRegTrashCan, null)
    )))
  )))));
};
const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  initialData: initialData2
}) => {
  const [class_name, setClass_name] = reactExports.useState("");
  if (!isOpen) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg p-6 w-96 shadow-lg" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl mb-4 mx-4" }, " Add New Class "), /* @__PURE__ */ React.createElement("div", { className: "flex items-center mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "ml-4 w-full" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: class_name,
      onChange: (e) => setClass_name(e.target.value),
      className: "text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500",
      placeholder: "Enter Class Name"
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end mt-6 space-x-4" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onClose,
      className: "px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 focus:ring focus:ring-pink-300"
    },
    "Cancel"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onConfirm({ class_name }),
      className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
    },
    "Confirm"
  ))));
};
const Page = ({ data }) => {
  const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfTokenElement ? csrfTokenElement.getAttribute("content") : "";
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleConfirm = async (formData) => {
    try {
      const response = await axios.post("/classes", {
        ...formData,
        _token: csrfToken
      });
      if (response.status === 201) {
        console.log("Class added successfully");
        window.location.reload();
      } else {
        console.error("Failed to add class");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsModalOpen(false);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen overflow-y-auto bg-gray-100 p-4" }, /* @__PURE__ */ React.createElement(ReportsComponent, { name: "Class" }), /* @__PURE__ */ React.createElement(Box, { sx: { flexGrow: 1 } }, /* @__PURE__ */ React.createElement(
    Grid2,
    {
      container: true,
      justifyContent: "center",
      alignItems: "center",
      mt: 2
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex justify-center items-center w-full" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleOpenModal,
        className: "bg-white w-full text-blue-500 border rounded-full px-4 py-2 hover:bg-blue-50 transition duration-200 focus:outline-none"
      },
      "Add Data +"
    ), /* @__PURE__ */ React.createElement(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: handleCloseModal,
        onConfirm: handleConfirm
      }
    ))
  ), /* @__PURE__ */ React.createElement(Grid2, { container: true, mt: 2 }, /* @__PURE__ */ React.createElement(Grid2, { size: { xs: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-xl" }, /* @__PURE__ */ React.createElement(Table, { data }))))));
};
const TableCRUD = ({ initialData: initialData2 }) => {
  const [data, setData] = reactExports.useState(initialData2);
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen overflow-hidden" }, /* @__PURE__ */ React.createElement(Sidebar, { user: data.user }), /* @__PURE__ */ React.createElement("div", { className: "relative flex flex-col flex-1 overflow-x-hidden" }, /* @__PURE__ */ React.createElement("main", null, /* @__PURE__ */ React.createElement(Page, { data: data.classes }))));
};
const ssrData = (_a = document.getElementById("app")) == null ? void 0 : _a.getAttribute("data-ssr");
const initialData = ssrData ? JSON.parse(ssrData) : {};
if (document.getElementById("app")) {
  ReactDOM.createRoot(document.getElementById("app")).render(
    /* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(BrowserRouter, null, /* @__PURE__ */ React.createElement(TableCRUD, { initialData })))
  );
}
