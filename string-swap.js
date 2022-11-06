import fs from 'fs'

const stringSwap = async (findReplaceMap, inputFile, outputFile) => {
    const errs = []
    const err = (str) => {
        errs.push(str)
        if(errs.some(x => x.toLowerCase().includes('fatal'))){
            console.log('stringSwap Errors:\n\t'+errs.join('\n\t'))
            process.exit(0)
        }
    } 

    try{

        if(!Array.isArray(findReplaceMap) || !findReplaceMap.length) err('FATAL: "findReplaceMap" must be a nested Array with a structure like: [ ["find-string-or-regex", "replace-string"] ]')
        if(typeof inputFile !== 'string') err('FATAL: "inputFile" must be a valid string path to an existing file')
        if(typeof outputFile !== 'string' || outputFile === ''){
            err('WARN: No "outputFile" provided. Writing to "inputFile"')
            outputFile = inputFile
        }
        if(!fs.existsSync(inputFile)) err(`FATAL: The file "${inputFile}" does not exist`)

        let fileContent = fs.readFileSync(inputFile, { encoding: 'utf-8'})
        if(!fileContent) err(`FATAL: No data in file "${inputFile}"`)

        findReplaceMap.forEach(([find, replace], idx) => {
            if(typeof replace !== 'string') err(`FATAL: The "replace" value in "findReplaceMap" must be a string. Recieved "${replace}"`)
            if(typeof find === 'string'){
                fileContent = fileContent.replace(new RegExp(find, 'g'), replace)
            }else if(find instanceof RegExp){
                fileContent = fileContent.replace(find, replace)
            }else{ err(`FATAL: The "find" key in "findReplaceMap" must be a string or regular expression`) }
        })

        fs.writeFileSync(outputFile, fileContent)
        console.log(`stringSwap: Wrote to file "${outputFile}"`)
    }catch(e){
        err(e.message ?? e)
    }
}

export default stringSwap


stringSwap([
    [/{{ayo}}/g, 'woooah!!']
], './test.md')
