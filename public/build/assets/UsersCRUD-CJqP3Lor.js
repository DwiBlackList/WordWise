var _a;
import { r as reactExports, R as React, b as ReactDOM, B as BrowserRouter } from "./chunk-K6AXKMTT-llj0GQDa.js";
import { R as ReportsComponent, B as Box, G as Grid2, S as Sidebar } from "./Sidebar-7LvJyKI1.js";
import { a as FaPencil, F as FaRegTrashCan } from "./index-CMMxcWw_.js";
import { a as axios } from "./axios-Cl7A0Ixg.js";
import "./_commonjsHelpers-DWwsNxpa.js";
const ModalEdit = ({
  isOpen,
  onClose,
  onConfirm,
  initialData: initialData2
}) => {
  const [data, setData] = reactExports.useState(initialData2);
  reactExports.useEffect(() => {
    setData(initialData2);
  }, [initialData2]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const validateInput = () => {
    if (!data.name || !data.school || !data.password || !data.role) {
      alert("Please fill in all fields");
      return false;
    }
    return true;
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg p-6 w-96 shadow-lg" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl mb-4 mx-4" }, "Edit User"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "ml-4 w-full" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      name: "name",
      value: data.name,
      onChange: handleInputChange,
      className: "text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4",
      placeholder: "User Name",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      name: "school",
      value: data.school,
      onChange: handleInputChange,
      className: "text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4",
      placeholder: "School Name",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      name: "password",
      value: data.password,
      onChange: handleInputChange,
      className: "text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4",
      placeholder: "Password",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      name: "role",
      value: data.role,
      onChange: handleInputChange,
      className: "text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4",
      required: true
    },
    /* @__PURE__ */ React.createElement("option", { value: "", disabled: true }, "Select Role"),
    /* @__PURE__ */ React.createElement("option", { value: "admins" }, "Admin"),
    /* @__PURE__ */ React.createElement("option", { value: "teacher" }, "Teacher"),
    /* @__PURE__ */ React.createElement("option", { value: "student" }, "Student")
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
      onClick: () => validateInput() ? onConfirm(data) : null,
      className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
    },
    "Confirm"
  ))));
};
const Table = ({ data }) => {
  reactExports.useState(false);
  reactExports.useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = reactExports.useState(false);
  const [editData, setEditData] = reactExports.useState(null);
  const handleOpenEditModal = (row) => {
    setEditData(row);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => setIsEditModalOpen(false);
  const handleConfirmEdit = async (formData) => {
    try {
      const response = await axios.put(`/users/${formData.id}`, formData);
      if (response.status === 200) {
        console.log("User updated successfully");
        window.location.reload();
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/users/${id}`);
      if (response.status === 200) {
        console.log("Class deleted successfully");
        window.location.reload();
      } else {
        console.error("Failed to delete class");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto w-full" }, /* @__PURE__ */ React.createElement("table", { className: "table-auto w-full border-collapse shadow-xl" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-white border-b border-gray-200" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-2 sm:px-4 py-2 text-left text-gray-600 w-1/3" }, "Name"), /* @__PURE__ */ React.createElement("th", { className: "px-2 sm:px-4 py-2 text-left text-gray-600 w-1/3" }, "School"), /* @__PURE__ */ React.createElement("th", { className: "px-2 sm:px-4 py-2 text-left text-gray-600 w-1/4" }, "Role"), /* @__PURE__ */ React.createElement("th", { className: "px-2 sm:px-4 py-2 text-center text-gray-600 w-1/6" }, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, data == null ? void 0 : data.map((row, index) => /* @__PURE__ */ React.createElement(
    "tr",
    {
      key: index,
      className: "bg-white cursor-pointer hover:bg-gray-100"
    },
    /* @__PURE__ */ React.createElement("td", { className: "px-2 sm:px-4 py-2" }, row.name),
    /* @__PURE__ */ React.createElement("td", { className: "px-2 sm:px-4 py-2" }, row.school),
    /* @__PURE__ */ React.createElement("td", { className: "px-2 sm:px-4 py-2" }, row.role),
    /* @__PURE__ */ React.createElement("td", { className: "px-2 sm:px-4 py-2 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-4 justify-center" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "text-gray-500 transition duration-200",
        onClick: (e) => {
          e.stopPropagation();
          handleOpenEditModal(row);
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
            `Are you sure you want to delete ${row.name}?`
          )) {
            handleDelete(row.id);
          }
        }
      },
      /* @__PURE__ */ React.createElement(FaRegTrashCan, null)
    )))
  )))), isEditModalOpen && editData && /* @__PURE__ */ React.createElement(
    ModalEdit,
    {
      isOpen: isEditModalOpen,
      onClose: handleCloseEditModal,
      onConfirm: handleConfirmEdit,
      initialData: editData
    }
  ));
};
const Modal = ({
  onConfirm,
  initialData: initialData2,
  state,
  onClose,
  isEdit
}) => {
  const [dataAdd, setDataAdd] = reactExports.useState({
    name: "",
    email: "",
    school: "",
    password: "",
    role: ""
  });
  const [dataEdit, setDataEdit] = reactExports.useState(initialData2);
  reactExports.useEffect(() => {
    if (initialData2) {
      setDataEdit(initialData2);
    }
  }, [initialData2]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataEdit((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const validateInput = () => {
    if (state == false ? !dataAdd.name || !dataAdd.email || !dataAdd.school || !dataAdd.password || !dataAdd.role : !dataEdit.name || !dataEdit.school || !dataEdit.password || !dataEdit.role) {
      alert("Please fill in all fields");
      return false;
    }
    return true;
  };
  if (!state) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg p-6 w-96 shadow-lg" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl mb-4 mx-4" }, "Add New User"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "ml-4 w-full" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      name: "name",
      value: dataEdit.name,
      onChange: handleInputChange,
      className: "text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4",
      placeholder: "User Name",
      required: true
    }
  ), isEdit ? null : /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      name: "email",
      onChange: handleInputChange,
      className: "text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4",
      placeholder: "Email",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      name: "school",
      value: dataEdit.school,
      onChange: handleInputChange,
      className: "text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4",
      placeholder: "School Name",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      name: "password",
      value: dataEdit.password,
      onChange: handleInputChange,
      className: "text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4",
      placeholder: "Password",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      name: "role",
      value: dataEdit.role,
      onChange: handleInputChange,
      className: "text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4",
      required: true
    },
    /* @__PURE__ */ React.createElement("option", { value: "", disabled: true }, "Select Role"),
    /* @__PURE__ */ React.createElement("option", { value: "admins" }, "Admin"),
    /* @__PURE__ */ React.createElement("option", { value: "teacher" }, "Teacher"),
    /* @__PURE__ */ React.createElement("option", { value: "student" }, "Student")
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
      onClick: () => validateInput() ? state == true ? onConfirm(dataEdit) : onConfirm(dataAdd) : null,
      className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
    },
    "Confirm"
  ))));
};
const Page = ({ data }) => {
  const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfTokenElement ? csrfTokenElement.getAttribute("content") : "";
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const [selectedRow, setSelectedRow] = reactExports.useState({
    name: "",
    school: "",
    password: "",
    role: ""
  });
  const [isEdit, setIsEdit] = reactExports.useState(false);
  const handleOpenModal = () => {
    setIsEdit(false);
    setSelectedRow(selectedRow);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleAddData = async (formData) => {
    console.log("formData: ", formData);
    try {
      const response = await axios.post("/users", {
        ...formData,
        _token: csrfToken
      });
      if (response.status === 200) {
        console.log("Users added successfully");
      }
    } catch (error) {
      console.error(error);
    }
    setIsModalOpen(false);
  };
  const handleEditData = async (row, formData) => {
    try {
      const response = await axios.put(`/users/${row.id}`, {
        ...formData,
        _token: csrfToken
      });
      if (response.status === 200) {
        window.location.reload();
        console.log("Users edited successfully");
      }
    } catch (error) {
      console.error(error);
    }
    setIsModalOpen(false);
  };
  const handleConfirm = (data2) => {
    isEdit ? handleEditData(data2, data2) : handleAddData(data2);
  };
  const handleEdit = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
    setIsEdit(true);
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/users/${id}`, {
        data: { _token: csrfToken }
      });
      if (response.status === 200) {
        console.log("User deleted successfully");
        window.location.reload();
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen overflow-y-auto bg-gray-100 p-4" }, /* @__PURE__ */ React.createElement(ReportsComponent, { name: "Users" }), /* @__PURE__ */ React.createElement(Box, { sx: { flexGrow: 1 } }, /* @__PURE__ */ React.createElement(
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
        state: isModalOpen,
        onClose: handleCloseModal,
        onConfirm: handleConfirm,
        initialData: selectedRow,
        isEdit
      }
    ))
  ), /* @__PURE__ */ React.createElement(Grid2, { container: true, mt: 2 }, /* @__PURE__ */ React.createElement(Grid2, { size: { xs: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-xl" }, /* @__PURE__ */ React.createElement(
    Table,
    {
      data,
      handleEdit,
      handleDelete
    }
  ))))));
};
const TableCRUD = ({ initialData: initialData2 }) => {
  const [data, setData] = reactExports.useState({
    users: initialData2.users || [],
    dataUserLogin: initialData2.dataUserLogin || []
  });
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen overflow-hidden" }, /* @__PURE__ */ React.createElement(Sidebar, { user: data.dataUserLogin }), /* @__PURE__ */ React.createElement("div", { className: "relative flex flex-col flex-1 overflow-x-hidden" }, /* @__PURE__ */ React.createElement("main", null, /* @__PURE__ */ React.createElement(Page, { data: data.users }))));
};
const usersData = (_a = document.getElementById("app")) == null ? void 0 : _a.getAttribute("users");
const initialData = usersData ? JSON.parse(usersData) : [];
if (document.getElementById("app")) {
  ReactDOM.createRoot(document.getElementById("app")).render(
    /* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(BrowserRouter, null, /* @__PURE__ */ React.createElement(TableCRUD, { initialData })))
  );
}
