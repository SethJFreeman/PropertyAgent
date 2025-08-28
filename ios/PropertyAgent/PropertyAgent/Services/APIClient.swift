import Foundation

struct SearchResponse: Codable {
    let facts: [Fact]
}

class APIClient {
    var baseURL = URL(string: "http://localhost:3000")!

    func sendMessage(threadId: String, text: String) async throws -> ChatResponse {
        let requestBody = ChatRequest(thread_id: threadId, text: text, tech_id: "tech_local", property_id: "prop_demo")
        var req = URLRequest(url: baseURL.appendingPathComponent("chat"))
        req.httpMethod = "POST"
        req.addValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try JSONEncoder().encode(requestBody)
        let (data, _) = try await URLSession.shared.data(for: req)
        return try JSONDecoder().decode(ChatResponse.self, from: data)
    }

    func searchFacts(q: String) async throws -> [Fact] {
        var comps = URLComponents(url: baseURL.appendingPathComponent("facts/search"), resolvingAgainstBaseURL: false)!
        comps.queryItems = [
            URLQueryItem(name: "property_id", value: "prop_demo"),
            URLQueryItem(name: "q", value: q)
        ]
        let url = comps.url!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(SearchResponse.self, from: data).facts
    }
}
