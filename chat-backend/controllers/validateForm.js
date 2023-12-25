const Yup = require("yup");
const createError = require("http-errors");

const formSchema = Yup.object({
  username: Yup.string()
    .required("Username required")
    .min(6, "Username too short")
    .max(28, "Username too long!"),
  password: Yup.string()
    .required("Password required")
    .min(6, "Password too short")
    .max(28, "Password too long!"),
});

const validateForm = (req, res, next) => {
  const formdata = req.body;
  formSchema
    .validate(formdata)
    .catch((err) => {
      console.log(err.errors);
      return next(createError(422, err.errors[0] || "Provide proper fields"));
    })
    .then((valid) => {
      if (valid) {
        next();
      } else {
        return next(createError(422));
      }
    });
};

module.exports = validateForm;
