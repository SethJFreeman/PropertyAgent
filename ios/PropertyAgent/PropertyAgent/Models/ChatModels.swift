import Foundation

struct Message: Identifiable, Codable {
    let id = UUID()
    let role: String
    let text: String
}

struct ChatRequest: Codable {
    let thread_id: String
    let text: String
    let tech_id: String
    let property_id: String
}

struct ActionData: Codable {
    let unit: String?
    let summary: String?
    let part: String?
    let priority: String?
}

struct Action: Codable {
    let type: String
    let data: ActionData
}

struct ChatResponse: Codable {
    let assistant_reply: String
    let action: Action
    let facts_added: [Fact]
}

struct Fact: Codable, Identifiable {
    let id: Int?
    let property_id: String
    let unit: String?
    let category: String
    let summary: String
    let score: Double?
}
