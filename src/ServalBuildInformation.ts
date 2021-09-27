export class ServalBuildInformation {
    public readonly version: string = "{{version}}"
    public readonly build: string = "{{build}}"
    public readonly date: string = "{{date}}"
    public readonly commit: string = "{{commit}}"
    public readonly dependencies: object

    private constructor() {
        try {
            // eslint-disable-next-line @typescript-eslint/quotes
            this.dependencies = JSON.parse(`{{dependencies}}`)
        } catch (e) {
            this.dependencies = {}
        }
    }

    public static readonly info: ServalBuildInformation = new ServalBuildInformation()
}
