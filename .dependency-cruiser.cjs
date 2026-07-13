/** @type {import("dependency-cruiser").IConfiguration} */
module.exports = {
    forbidden: [
        {
            name: "no-circular",
            severity: "error",
            from: {},
            to: {
                circular: true
            }
        }
    ]
}
