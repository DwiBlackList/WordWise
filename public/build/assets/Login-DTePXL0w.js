import { c as createLucideIcon, R as React, r as reactExports, b as ReactDOM, B as BrowserRouter } from "./chunk-K6AXKMTT-llj0GQDa.js";
import { c as cn, B as Button, A as ArrowLeft } from "./button-DUIenwLR.js";
import { a as axios } from "./axios-Cl7A0Ixg.js";
import "./_commonjsHelpers-DWwsNxpa.js";
/**
 * @license lucide-react v0.464.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Eye = createLucideIcon("Eye", [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Background = () => {
  return /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 left-0 right-0" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "/gunungcrop.png",
      alt: "Mountain silhouette",
      className: "w-[500%] sm:w-[200%] translate-y-20"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "absolute top-60 left-10 sm:left-32" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "/awan 2.svg",
      alt: "Cloud",
      className: "w-[150%] sm:w-[200%] translate-y-10"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "absolute sm:bottom-60 bottom-20 right-10 sm:right-40" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "/awan 2.svg",
      alt: "Cloud",
      className: "w-[150%] sm:w-[200%] translate-y-10"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "absolute top-5 right-20 sm:right-96" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "/awan 1.svg",
      alt: "Cloud",
      className: "w-[150%] sm:w-[200%] translate-y-10"
    }
  )));
};
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ reactExports.createElement(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const LoginForm = () => {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfTokenElement ? csrfTokenElement.getAttribute("content") : "";
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/login", {
        email,
        password,
        _token: csrfToken
      });
      window.location.href = "/home";
    } catch (error) {
    }
  };
  return /* @__PURE__ */ React.createElement("form", { className: "space-y-3 sm:space-y-4", onSubmit: handleSubmit }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(
    Input,
    {
      type: "text",
      placeholder: "Email",
      className: "h-10 sm:h-12 rounded-full border-slate-200",
      value: email,
      onChange: (e) => setEmail(e.target.value)
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 relative" }, /* @__PURE__ */ React.createElement(
    Input,
    {
      type: "password",
      placeholder: "Password",
      className: "h-10 sm:h-12 rounded-full border-slate-200 pr-10",
      value: password,
      onChange: (e) => setPassword(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "absolute right-3 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600",
      "aria-label": "Toggle password visibility"
    },
    /* @__PURE__ */ React.createElement(Eye, { className: "h-4 w-4 sm:h-5 sm:w-5" })
  )), /* @__PURE__ */ React.createElement("div", { className: "text-right" }, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "/forgot-password",
      className: "text-xs sm:text-sm text-slate-600 hover:text-slate-800"
    },
    "Forgot password?"
  )), /* @__PURE__ */ React.createElement(
    Button,
    {
      type: "submit",
      className: "w-full h-10 sm:h-12 rounded-full bg-orange-400 hover:bg-orange-500 text-white font-semibold text-sm sm:text-base"
    },
    "Login"
  ));
};
const Login = () => {
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-[#89e8f5] flex items-center justify-center p-4 sm:p-6 md:p-8" }, /* @__PURE__ */ React.createElement(Background, null), /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-md bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-4 sm:space-y-6 relative" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-4 left-4" }, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "/",
      className: "text-orange-400 hover:text-orange-500 flex items-center space-x-2"
    },
    /* @__PURE__ */ React.createElement(ArrowLeft, { className: "h-5 w-5" }),
    /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, "Back")
  )), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center space-y-4" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "logo.svg",
      alt: "logo",
      className: "h-8 sm:h-10 md:h-12"
    }
  ), /* @__PURE__ */ React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold text-slate-700" }, "Welcome back!"), /* @__PURE__ */ React.createElement("h4", { className: "text-sm text-slate-500 font-semibold" }, "Login For Teacher")), /* @__PURE__ */ React.createElement(LoginForm, null)));
};
if (document.getElementById("app")) {
  ReactDOM.createRoot(document.getElementById("app")).render(
    /* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(BrowserRouter, null, /* @__PURE__ */ React.createElement(Login, null)))
  );
}
