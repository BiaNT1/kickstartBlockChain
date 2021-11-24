const path = require('path')
const fs = require('fs-extra')
const solc = require('solc')

const buildPath = path.resolve(__dirname, 'build')
//remove build trong path:buildPath
fs.removeSync(buildPath)

const campaignPath = path.resolve(__dirname, 'contract', 'Campaign.sol')
const source = fs.readFileSync(campaignPath, "utf8")
const output = solc.compile(source, 1).contracts;

//add build vao dung thu muc buildPath
fs.ensureDirSync(buildPath)
console.log(output)
for(let contract in output) {
    //chuyen output thanh dang JSon
    fs.outputJSONSync(
        //xay dung tep output ra tai path:buidPath (path/:{contract}.json)
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]        
    )
}