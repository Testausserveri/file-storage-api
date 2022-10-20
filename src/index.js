import express from "express"
import multer from "multer"
import fs from "fs/promises"
import path from "path"

const uploadsFolder = "./uploads"

const fileExists = async (filename) => {
    try {
        await fs.stat(filename)
        return true
    } catch (e) {
        return false
    }
}

if (!await fileExists(".apikeys")) {
    console.error("No .apikeys file")
    process.exit(1)
}


const apiKeys = (await fs.readFile(".apikeys", "utf8")).split("\n")
const app = express()

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadsFolder);
    },
    filename: (req, file, callback) => {
        callback(null, (Math.random() + 1).toString(36).substring(7) + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage }).single("file");

app.use((req, res, next) => {
    const auth = req.headers.authorization
    if (!auth
        || !auth.startsWith("ApiKey ")
        || !apiKeys.includes(auth.split(" ")[1])) return res.status(401).json({ error: "unauthorized" })
    next()
})

app.post("/", upload, (req, res) => {
    const filename = req.file.filename
    console.log(`Uploaded ${filename} (${req.file.size})`)
    res.status(200).json({ filename })
})

app.get("/", async (req, res) => {
    const files = await fs.readdir(uploadsFolder)
    res.status(200).json({ files })
})

app.use("/:filename", async (req, res, next) => {
    if (req.locals === undefined) req.locals = {}

    // prevents directory traversal
    req.locals.filename = path.normalize(req.params.filename).replace(/^(\.\.(\/|\\|$))+/, "")

    req.locals.filePath = path.join(uploadsFolder, req.locals.filename)
    if (!await fileExists(req.locals.filePath)) return res.status(404).json({ error: "not found" })

    next()
})

app.get("/:filename", (req, res) => {
    res.sendFile(req.locals.filename, { root: uploadsFolder })
})

app.delete("/:filename", async (req, res) => {
    await fs.unlink(req.locals.filePath)

    const filename = req.locals.filename
    console.log(`Deleted ${filename}`)
    res.status(200).json({ filename })
})

app.listen(8080)
