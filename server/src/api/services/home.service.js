export default class HomeService {
    async printHello() {
        return {
            success: true,
            message:
                "Hello from the server. Sheet Loader API is up and running!",
        }
    }
}
