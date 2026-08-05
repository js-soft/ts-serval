#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const nsprcPath = resolve(process.cwd(), ".nsprc")

handleNpmAudit()

function handleNpmAudit() {
    const firstAudit = runBetterNpmAudit()
    const newVulnerabilityIds = extractUnhandledVulnerabilityIds(firstAudit.output)

    if (firstAudit.status === 0) {
        console.log("No new vulnerabilities found.")
        return
    }

    if (!newVulnerabilityIds.length) {
        failUnexpectedAuditResult(firstAudit)
    }

    console.log(`New vulnerability IDs: ${newVulnerabilityIds.join(",")}`)

    runNpmAuditFix()

    const secondAudit = runBetterNpmAudit()
    const remainingVulnerabilityIds = extractUnhandledVulnerabilityIds(secondAudit.output)

    if (secondAudit.status === 0) {
        console.log("No vulnerabilities remain after npm audit fix.")
        return
    }

    if (!remainingVulnerabilityIds.length) {
        failUnexpectedAuditResult(secondAudit)
    }

    const addedExceptionIds = addExceptionsToNsprc(remainingVulnerabilityIds)

    if (addedExceptionIds.length) {
        console.log(`Added vulnerability IDs to .nsprc: ${addedExceptionIds.join(",")}`)
    } else {
        console.log("Remaining vulnerability IDs were already active in .nsprc.")
    }
}

function runBetterNpmAudit() {
    const result = spawnSync("npx", ["--yes", "better-npm-audit", "audit"], {
        encoding: "utf8",
        shell: false
    })
    const output = `${result.stdout ?? ""}${result.stderr ?? ""}`

    if (output) {
        process.stdout.write(output)
        if (!output.endsWith("\n")) process.stdout.write("\n")
    }

    if (result.error) {
        throw result.error
    }

    return { output, status: result.status ?? 1 }
}

function runNpmAuditFix() {
    console.log("Running npm audit fix...")

    const result = spawnSync("npm", ["audit", "fix"], {
        encoding: "utf8",
        shell: false,
        stdio: "inherit"
    })

    if (result.error) {
        throw result.error
    }

    if (result.status && result.status > 1) {
        process.exit(result.status)
    }
}

function extractUnhandledVulnerabilityIds(output) {
    const ids = []
    const advisoryLines = output.matchAll(/Node security advisories:\s*([^\r\n]+)/gi)

    for (const advisoryLine of advisoryLines) {
        ids.push(...parseIdList(advisoryLine[1]))
    }

    return Array.from(new Set(ids)).sort()
}

function addExceptionsToNsprc(ids) {
    const nsprc = readNsprc()
    const added = []

    for (const id of ids) {
        if (isActiveException(nsprc[id])) continue

        nsprc[id] = {}
        added.push(id)
    }

    writeNsprc(nsprc)

    return added
}

function readNsprc() {
    try {
        return JSON.parse(readFileSync(nsprcPath, "utf8"))
    } catch (error) {
        if (error.code === "ENOENT") return {}
        throw error
    }
}

function isActiveException(exception) {
    if (exception === undefined) return false
    if (typeof exception === "string") return true
    if (exception.active === false) return false
    if (!exception.expiry) return true

    return new Date(exception.expiry).getTime() > Date.now()
}

function writeNsprc(nsprc) {
    const sortedNsprc = {}

    for (const id of Object.keys(nsprc).sort()) {
        sortedNsprc[id] = nsprc[id]
    }

    writeFileSync(nsprcPath, `${JSON.stringify(sortedNsprc, null, 4)}\n`)
}

function parseIdList(ids) {
    return ids.split(",").map(normalizeId).filter(Boolean)
}

function failUnexpectedAuditResult(audit) {
    console.error("better-npm-audit failed, but no vulnerability IDs could be read from its output.")
    process.exit(audit.status)
}

function normalizeId(id) {
    return String(id ?? "").trim()
}
