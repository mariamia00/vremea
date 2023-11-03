"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var user_router_1 = __importDefault(require("./routers/user.router"));
var database_config_1 = require("./database.config");
var post_router_1 = __importDefault(require("./routers/post.router"));
var path_1 = __importDefault(require("path")); // Import 'path' module
var mongoose_1 = __importDefault(require("mongoose"));
var user_model_1 = require("./models/user.model");
var contact_router_1 = __importDefault(require("./routers/contact.router"));
var comments_router_1 = __importDefault(require("./routers/comments.router"));
(0, database_config_1.dbConnect)();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(
  (0, cors_1.default)({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);
var UserModel = mongoose_1.default.model("User", user_model_1.UserSchema);
// Serve static files from the Angular dist directory
app.use(
  express_1.default.static(
    path_1.default.join(__dirname, "../../frontend/dist/weather/")
  )
);
// Define a catch-all route that serves your Angular app's index.html
app.get("*", function (req, res) {
  res.sendFile(
    path_1.default.join(__dirname, "../../frontend/dist/weather/index.html")
  );
});
app.use(
  "/uploads",
  express_1.default.static(path_1.default.join(__dirname, "uploads"))
);
app.use("/api/users", user_router_1.default);
app.use("/api", post_router_1.default);
app.use("/api", contact_router_1.default);
app.use("/api/comments", comments_router_1.default);
var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("website served on http://localhost:" + port);
});
