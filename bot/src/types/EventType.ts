export default interface EventType {
    prodEvent? : boolean
    cluster?: boolean
    name: string,
    once?: boolean,
    execute(...args: any): Promise<void>,
}