import SwiftUI

struct ContentView: View {
    @State private var messages: [Message] = []
    @State private var inputText: String = ""
    @State private var pendingAction: Action? = nil
    let api = APIClient()

    var body: some View {
        VStack {
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 12) {
                    ForEach(messages) { msg in
                        HStack {
                            if msg.role == "assistant" {
                                Text(msg.text)
                                    .padding(10)
                                    .background(Color.gray.opacity(0.2))
                                    .cornerRadius(8)
                                Spacer()
                            } else {
                                Spacer()
                                Text(msg.text)
                                    .padding(10)
                                    .background(Color.blue.opacity(0.2))
                                    .cornerRadius(8)
                            }
                        }
                    }
                }.padding()
            }

            if let action = pendingAction, action.type != "none" {
                Button(action: {}) {
                    Text("Action: \(actionLabel(action.type)) – Tap to confirm")
                        .font(.caption)
                        .padding(8)
                        .frame(maxWidth: .infinity)
                        .background(Color.orange.opacity(0.2))
                        .cornerRadius(8)
                }.padding(.horizontal)
            }

            HStack {
                TextField("Message", text: $inputText)
                    .textFieldStyle(.roundedBorder)
                Button("Send") {
                    send()
                }
                .disabled(inputText.isEmpty)
            }
            .padding()
        }
    }

    func send() {
        let text = inputText
        inputText = ""
        messages.append(Message(role: "user", text: text))
        Task {
            do {
                let resp = try await api.sendMessage(threadId: threadId(), text: text)
                messages.append(Message(role: "assistant", text: resp.assistant_reply))
                pendingAction = resp.action
            } catch {
                messages.append(Message(role: "assistant", text: "Error: \(error.localizedDescription)"))
            }
        }
    }

    func threadId() -> String {
        if let id = UserDefaults.standard.string(forKey: "thread_id") {
            return id
        }
        let id = UUID().uuidString
        UserDefaults.standard.set(id, forKey: "thread_id")
        return id
    }

    func actionLabel(_ type: String) -> String {
        switch type {
        case "create_work_order": return "Create Work Order"
        case "need_part": return "Need Part"
        case "schedule_vendor": return "Schedule Vendor"
        default: return type.capitalized
        }
    }
}

#Preview {
    ContentView()
}
