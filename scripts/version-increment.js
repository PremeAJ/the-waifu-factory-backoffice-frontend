const fs = require("fs");
const path = require("path");

const packageJsonPath = path.join(__dirname, "..", "package.json");

// อ่านไฟล์ package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

// แยกส่วนเวอร์ชัน
const parts = packageJson.version.split(".");
const patch = parseInt(parts[2], 10);

// เพิ่มค่า patch ขึ้น 1
parts[2] = patch + 1;

// รวมเวอร์ชันใหม่
const newVersion = parts.join(".");
packageJson.version = newVersion;

// เขียนเวอร์ชันใหม่กลับลงไฟล์ package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

console.log(`Version incremented to ${newVersion}`);