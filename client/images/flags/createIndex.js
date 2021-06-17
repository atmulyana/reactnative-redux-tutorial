//Node.js script
const fs = require("fs");
const files = fs.readdirSync("./").filter(x => x.includes("png"));
const sObj = "{\n" +
    files.map(x => `"${x.split(".png")[0]}": require("./${x}"),`).join("\n")
    + "\n}";
fs.writeFileSync("./index.js", "export default " + sObj);