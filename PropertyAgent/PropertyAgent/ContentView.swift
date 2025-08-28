import SwiftUI
import UIKit

struct ContentView: View {
    @State private var showConfetti = false

    var body: some View {
        ZStack {
            Button("Celebrate 🎉") {
                showConfetti = true
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    showConfetti = false
                }
            }
            .font(.largeTitle).bold()
            .padding()

            if showConfetti {
                ConfettiView()
                    .ignoresSafeArea()
            }
        }
    }
}

struct ConfettiView: UIViewRepresentable {
    func makeUIView(context: Context) -> UIView {
        let view = UIView()

        let emitter = CAEmitterLayer()
        let frame = UIScreen.main.bounds
        emitter.emitterPosition = CGPoint(x: frame.width / 2, y: -10)
        emitter.emitterShape = .line
        emitter.emitterSize = CGSize(width: frame.width, height: 2)

        let colors: [UIColor] = [.systemRed, .systemBlue, .systemGreen, .systemOrange, .systemPink, .systemPurple]
        emitter.emitterCells = colors.map { color in
            let cell = CAEmitterCell()
            cell.birthRate = 20
            cell.lifetime = 5.0
            cell.velocity = 200
            cell.velocityRange = 50
            cell.emissionLongitude = .pi
            cell.emissionRange = .pi / 4
            cell.spin = 4
            cell.spinRange = 8
            cell.scale = 0.1
            cell.scaleRange = 0.2
            cell.color = color.cgColor
            cell.contents = UIImage(systemName: "rectangle.fill")?.cgImage
            return cell
        }

        view.layer.addSublayer(emitter)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            emitter.birthRate = 0
        }
        return view
    }

    func updateUIView(_ uiView: UIView, context: Context) {}
}

#Preview { ContentView() }
