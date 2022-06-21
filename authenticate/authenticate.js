// function authenticateMiddleware(req, res, next) {
//   if (req.session) {
//     if (req.session.username) {
//       next();
//     } else {
//       res.render("/user-login", {
//         errorMessage: "Invalid username or password",
//       });
//     }
//   } else {
//     res.render("/user-login", {
//       errorMessage: "Invalid username or password",
//     });
//   }
// }

// module.exports = authenticateMiddleware;
