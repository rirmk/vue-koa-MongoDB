import fs from "fs"

function checkDirExist(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}

export default checkDirExist;
