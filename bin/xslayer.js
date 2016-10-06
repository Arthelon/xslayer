#! /usr/bin/env node
const path = require("path")
const os = require("os")
const fs = require("fs-extra")
const basePath = path.join(os.homedir(), "Library", "Application Support", "Google", "Chrome")

const printUsage = () => {
    console.log(`Command line utility for removing chrome extensions:

    Usage:
        
        xslayer [extension_id]`)
}

const removeAppFolder = (id) => {
    fs.remove(path.join(basePath, "Default", "Extensions", id), err => {
        if (err && err.code == "ENOENT") {
            console.log("Extension folder not found, did you input the correct extension id?")
        } else if (err) {
            console.log("Error while removing app folder")
        }
    })
}

const removeMetaData = (id) => {
    const preferencesPath = path.join(basePath, "Default", "Preferences")
    fs.readFile(preferencesPath, {encoding:"utf-8"}, (err, data) => {
        if (err) {
            console.log("Error reading preferences file")
        } else {
            const jsonData = JSON.parse(data)
            delete jsonData["extensions"]["settings"][id]
            jsonData["extensions"]["install_signature"]["ids"] = jsonData["extensions"]["install_signature"]["ids"].filter(item => {
                return item != id
            })
            delete jsonData["protection"]["macs"]["extensions"]["settings"][id]
            fs.writeFile(preferencesPath, JSON.stringify(jsonData), err => {
                if (err) {
                    console.log("Error writing to preferences file")
                }
            })
        }
    })
}

const id = process.argv[2]
if (!id || !id.length) {
    printUsage()
} else {
    removeAppFolder(id)
    removeMetaData(id)
}
